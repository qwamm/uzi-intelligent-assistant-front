import React from 'react';
import { useEffect, useState, useRef } from "react";
import OpenSeaDragon from "openseadragon";
import '../styles/style.css'
import Annotorious from '@recogito/annotorious-openseadragon';
import SelectorPack from '@recogito/annotorious-selector-pack'
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';
import axios from "axios";
import BetterPolygon from '@recogito/annotorious-better-polygon';
import { fromGeoJSON, toGeoJSON } from 'svg-polygon-points';

const OpenSeadragonViewer = ({image, boxes, tool, url, seg, type, imageid, length, sidebar, date}) => {

    const [viewer, setViewer] = useState(null);
    const [anno, setAnno] = useState(null);
    const [info, setInfo] = useState({});
    const [closed, setClosed] = useState(true);
    const [tiffanno, setTiffAnno] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showSegments, setShowSegments] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

    const viewerRef = useRef(null);
    const annoRef = useRef(null);

    // Цвета для разных узлов
    const NODE_COLORS = [
        '#FF0000', // Красный
        '#00FF00', // Зеленый
        '#0000FF', // Синий
        '#FFFF00', // Желтый
        '#FF00FF', // Пурпурный
        '#00FFFF', // Голубой
        '#FFA500', // Оранжевый
        '#800080', // Фиолетовый
        '#008000', // Темно-зеленый
        '#FF69B4'  // Розовый
    ];

    console.log('Image:', image);
    console.log('Image length:', image?.length);
    console.log('Seg:', seg);

    const initOpenseadragon = () => {
        if (viewerRef.current) {
            viewerRef.current.destroy();
        }

        const viewer_tmp = OpenSeaDragon({
            id: "openseadragon",
            prefixUrl: "/static/front/openseadragon-images/",
            tileSources: image,
            sequenceMode: true,
            showNavigator: false,
            showFullPageControl: false,
            showHomeControl: false,
            showZoomControl: false,
        });

        viewerRef.current = viewer_tmp;
        setViewer(viewer_tmp);

        if (image && Array.isArray(image)) {
            console.log('Setting total pages from image array:', image.length);
            setTotalPages(image.length);
        }

        viewer_tmp.addHandler('zoom', function(event) {
            setZoomLevel(event.zoom);
        });

        return viewer_tmp;
    };

    const initializeAnnotations = (viewer) => {
        if (annoRef.current) {
            annoRef.current.destroy();
        }

        const annotateState = Annotorious(viewer, {
            readOnly: true,
            widgets: [
                'COMMENT',
                { widget: 'TAG', vocabulary: [ 'TI-RADS 1', 'TI-RADS 2', 'TI-RADS 3', 'TI-RADS 4', 'TI-RADS 5', 'Doctor result', 'AI'] }
            ],
            tools: ['ellipse', 'freehand', 'point'],
            formatter: formatter // Добавляем formatter в конфигурацию
        });

        annotateState.setDrawingTool('polygon');
        SelectorPack(annotateState);

        annoRef.current = annotateState;
        setAnno(annotateState);

        return annotateState;
    };

    // Функции управления OpenSeaDragon
    const zoomIn = () => {
        if (viewerRef.current) {
            viewerRef.current.viewport.zoomBy(1.5);
        }
    };

    const zoomOut = () => {
        if (viewerRef.current) {
            viewerRef.current.viewport.zoomBy(0.5);
        }
    };

    const fitToScreen = () => {
        if (viewerRef.current) {
            viewerRef.current.viewport.fitBounds(viewerRef.current.viewport.getHomeBounds());
        }
    };

    const goHome = () => {
        if (viewerRef.current) {
            viewerRef.current.viewport.goHome();
        }
    };

    const nextPage = () => {
        if (viewerRef.current && totalPages > 1) {
            const current = viewerRef.current.currentPage();
            const next = (current + 1) % totalPages;
            viewerRef.current.goToPage(next);
        }
    };

    const prevPage = () => {
        if (viewerRef.current && totalPages > 1) {
            const current = viewerRef.current.currentPage();
            const prev = (current - 1 + totalPages) % totalPages;
            viewerRef.current.goToPage(prev);
        }
    };

    const rotateLeft = () => {
        if (viewerRef.current) {
            const currentRotation = viewerRef.current.viewport.getRotation();
            viewerRef.current.viewport.setRotation(currentRotation - 90);
        }
    };

    const rotateRight = () => {
        if (viewerRef.current) {
            const currentRotation = viewerRef.current.viewport.getRotation();
            viewerRef.current.viewport.setRotation(currentRotation + 90);
        }
    };

    const toggleSegments = () => {
        setShowSegments(prev => !prev);
    };

    const updateAnnotationsForPage = (pageIndex) => {
        if (!annoRef.current || !tiffanno.length || !tiffanno[pageIndex]) {
            return;
        }

        annoRef.current.clearAnnotations();

        if (showSegments && tiffanno[pageIndex].length > 0) {
            tiffanno[pageIndex].forEach(annotation => {
                try {
                    // Проверяем аннотацию перед добавлением
                    if (annotation && annotation.id) {
                        annoRef.current.addAnnotation(annotation);
                    }
                } catch (error) {
                    console.error('Error adding annotation:', error);
                }
            });

            // Применяем стили с задержкой после добавления аннотаций
            setTimeout(() => {
                if (tiffanno[pageIndex] && tiffanno[pageIndex].length > 0) {
                    tiffanno[pageIndex].forEach(annotation => {
                        if (annotation && annotation.id) {
                            applyColorToAnnotation(annotation);
                        }
                    });
                }
            }, 100);
        }
    };

    const handlePageChange = (data) => {
        const newPage = data.page;
        setCurrentPage(newPage);
        console.log('ABCDEFGIHJKLMN')
        updateAnnotationsForPage(newPage);
    };

    const prepareAnnotations = () => {
        const actualPages = image?.length || 0;
        const annotations = Array.from({ length: actualPages }, () => []);

        console.log(`Preparing annotations for ${actualPages} pages`);
        console.log('Segments data:', seg);

        if (seg && seg.length > 0) {
            const nodeColorMap = new Map();

            // Назначаем уникальные цвета каждому узлу
            seg.forEach((segment, segmentIndex) => {
                const colorIndex = segmentIndex % NODE_COLORS.length;
                const nodeColor = NODE_COLORS[colorIndex];
                nodeColorMap.set(segment.id, nodeColor);
            });

            console.log('Node color mapping:', Array.from(nodeColorMap.entries()));

            // Для каждого узла
            seg.forEach((segment) => {
                if (!segment) return;

                const nodeColor = nodeColorMap.get(segment.id);
                const nodeId = segment.id;

                console.log(`Processing node ${nodeId} with ${segment.data?.length || 0} contours`);

                if (segment.data && segment.data.length > 0) {
                    // Для каждого контура узла
                    segment.data.forEach((contour, contourIndex) => {
                        if (!contour || !contour.points) return;

                        console.log(`Node ${nodeId}, contour ${contourIndex}: ${contour.points?.length || 0} points`);

                        if (contour.points && contour.points.length > 0) {
                            const pointsByPage = {};

                            // Группируем точки контура по страницам
                            contour.points.forEach(point => {
                                const pageIndex = point.z || 0;

                                if (pageIndex >= 0 && pageIndex < actualPages) {
                                    if (!pointsByPage[pageIndex]) {
                                        pointsByPage[pageIndex] = [];
                                    }
                                    pointsByPage[pageIndex].push(point);
                                }
                            });

                            // Создаем аннотацию для каждой страницы, где есть точки этого контура
                            Object.entries(pointsByPage).forEach(([pageIndexStr, points]) => {
                                const pageIndex = parseInt(pageIndexStr);

                                if (points.length >= 3) { // Минимум 3 точки для полигона
                                    try {
                                        const coord = points.map(point => [point.x, point.y]);
                                        const svgPoints = fromGeoJSON(coord).toString();
                                        const svgSelector = `<svg><polygon points="${svgPoints}"></polygon></svg>`;

                                        // Уникальный ID для каждой аннотации
                                        const uniqueAnnotationId = `node_${nodeId}_contour_${contourIndex}_page_${pageIndex}`;

                                        const annotation = {
                                            type: "Annotation",
                                            body: [
                                                {
                                                    type: "TextualBody",
                                                    value: `Узел ${nodeId}\nTI-RADS 2-3: ${Number((segment.details?.nodule_2_3 * 100) || 0).toFixed(1)}%\nTI-RADS 4: ${Number((segment.details?.nodule_4 * 100) || 0).toFixed(1)}%\nTI-RADS 5: ${Number((segment.details?.nodule_5 * 100) || 0).toFixed(1)}%`,
                                                    purpose: "commenting"
                                                },
                                                {
                                                    type: "TextualBody",
                                                    value: segment.is_ai ? "AI only" : "Updated",
                                                    purpose: "commenting"
                                                },
                                                {
                                                    type: "TextualBody",
                                                    value: "TI-RADS " + (segment.details?.nodule_type || 'Unknown'),
                                                    purpose: "tagging"
                                                },
                                                {
                                                    type: "TextualBody",
                                                    value: `Узел ${nodeId}`,
                                                    purpose: "group"
                                                },
                                                {
                                                    type: "TextualBody",
                                                    value: segment.is_ai ? "AI" : "Doctor result",
                                                    purpose: "tagging"
                                                },
                                                {
                                                    type: "TextualBody",
                                                    value: nodeColor,
                                                    purpose: "color"
                                                },
                                                {
                                                    type: "TextualBody",
                                                    value: nodeId.toString(),
                                                    purpose: "node-id"
                                                }
                                            ],
                                            target: {
                                                source: image[pageIndex]?.url || "http://localhost:5173/result/undefined",
                                                selector: {
                                                    type: "SvgSelector",
                                                    value: svgSelector,
                                                }
                                            },
                                            "@context": "http://www.w3.org/ns/anno.jsonld",
                                            id: uniqueAnnotationId
                                        };

                                        annotations[pageIndex].push(annotation);
                                        console.log(`Added annotation for node ${nodeId}, contour ${contourIndex} on page ${pageIndex} with ${points.length} points`);

                                    } catch (error) {
                                        console.error('Error creating annotation:', error);
                                    }
                                }
                            });
                        }
                    });
                }
            });

            // Подсчитываем реальное количество узлов на каждой странице
            annotations.forEach((pageAnnotations, pageIndex) => {
                const uniqueNodes = new Set();
                pageAnnotations.forEach(ann => {
                    const nodeIdBody = ann.body.find(b => b.purpose === 'node-id');
                    if (nodeIdBody) uniqueNodes.add(nodeIdBody.value);
                });
                console.log(`Page ${pageIndex}: ${pageAnnotations.length} annotations from ${uniqueNodes.size} unique nodes`);
            });
        } else {
            console.log('No segments data available');
        }

        console.log('Final annotations structure:',
            annotations.map((arr, idx) => `Page ${idx}: ${arr.length} annotations`));

        setTiffAnno(annotations);
        return annotations;
    };

    // Упрощенная функция formatter - возвращаем только метку
    const formatter = (annotation) => {
        // Проверяем TI-RADS категории для метки
        const isA = annotation.body.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 1'
        });
        const isB = annotation.body.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 2'
        });
        const isC = annotation.body.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 3'
        });
        const isD = annotation.body.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 4'
        });
        const isE = annotation.body.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 5'
        });
        const isDOC = annotation.body.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'doctor result'
        });

        // Определяем метку
        let label = '';
        if (isDOC) {
            if (isA) label = 'DOC-A';
            else if (isB) label = 'DOC-B';
            else if (isC) label = 'DOC-C';
            else if (isD) label = 'DOC-D';
            else if (isE) label = 'DOC-E';
            else label = 'DOC';
        } else {
            if (isA) label = 'A';
            else if (isB) label = 'B';
            else if (isC) label = 'C';
            else if (isD) label = 'D';
            else if (isE) label = 'E';
        }

        return label;
    };

    // Функция для применения стилей к аннотациям
    const applyAnnotationStyles = () => {
        if (!annoRef.current) return;

        // Добавляем кастомные стили для аннотаций
        const style = document.createElement('style');
        style.textContent = `
            .a9s-annotation .a9s-inner {
                stroke-width: 2px;
                stroke-opacity: 0.8;
                fill-opacity: 0.3;
            }

            /* Динамические стили будут применены через JavaScript */
        `;
        document.head.appendChild(style);

        // Применяем цвета к аннотациям после их загрузки
        annoRef.current.on('createAnnotation', (annotation) => {
            if (annotation && annotation.id) {
                setTimeout(() => {
                    applyColorToAnnotation(annotation);
                }, 100);
            }
        });
    };

    // Функция для применения цвета к конкретной аннотации
    const applyColorToAnnotation = (annotation) => {
        if (!annotation || !annotation.body) {
            console.warn('Invalid annotation object:', annotation);
            return;
        }

        console.log('ANNOTATION BODY', annotation.body)

        const colorBody = annotation.body.find(b => b.purpose === 'color');
        const nodeColor = colorBody ? colorBody.value : '#FF0000';

        // Находим элемент аннотации по ID
        const annotationElement = document.querySelector(`[data-id="${annotation.id}"]`);
        if (annotationElement) {
            const innerElement = annotationElement.querySelector('.a9s-inner');
            if (innerElement) {
                innerElement.style.stroke = nodeColor;
                innerElement.style.fill = nodeColor;

                // Также добавляем кастомный атрибут для отладки
                annotationElement.setAttribute('data-node-color', nodeColor);

                const nodeIdBody = annotation.body.find(b => b.purpose === 'node-id');
                if (nodeIdBody) {
                    annotationElement.setAttribute('data-node-id', nodeIdBody.value);
                }
            }
        }
    };

    const findPageWithAnnotations = (annotations) => {
        if (!annotations || !annotations.length) return 0;

        for (let i = 0; i < annotations.length; i++) {
            if (annotations[i] && annotations[i].length > 0) {
                console.log(`Found annotations on page ${i}`);
                return i;
            }
        }
        return 0;
    };

    // Получение информации о цветах узлов для отображения в легенде
    const getNodeColorInfo = () => {
        if (!seg || !seg.length) return [];

        const colorInfo = [];
        const usedColors = new Set();

        seg.forEach((segment, index) => {
            const colorIndex = index % NODE_COLORS.length;
            const color = NODE_COLORS[colorIndex];

            // Добавляем только уникальные цвета
            if (!usedColors.has(color)) {
                usedColors.add(color);
                colorInfo.push({
                    color: color,
                    nodeId: segment.id,
                    type: segment.details?.nodule_type || 'Unknown'
                });
            }
        });

        return colorInfo;
    };

    useEffect(() => {
        if (annoRef.current && viewerRef.current) {
            updateAnnotationsForPage(currentPage);
            applyAnnotationStyles();
        }
    }, [showSegments, currentPage]);

    useEffect(() => {
        if (annoRef.current) {
            annoRef.current.setDrawingTool(tool);
        }
    }, [tool]);

    useEffect(() => {
        // const date1 = new Date();
        // const date2 = new Date(date);
        // const timestamp1 = date1.getTime();
        // const timestamp2 = date2.getTime();
        // const difference = timestamp1 - timestamp2;
        // const daysDifference = Math.floor(difference / (1000 * 60));
        //
        // console.log('Разница в минутах:', daysDifference);

        if (seg !== null && seg.length !== 0) {
            const annotations = prepareAnnotations();

            if (annoRef.current && viewerRef.current) {
                const currentPage = viewerRef.current.currentPage();
                updateAnnotationsForPage(currentPage);
                applyAnnotationStyles();

                const pageWithAnnotations = findPageWithAnnotations(annotations);
                if (pageWithAnnotations !== currentPage) {
                    console.log(`Auto-switching to page ${pageWithAnnotations} with annotations`);
                    setTimeout(() => {
                        viewerRef.current.goToPage(pageWithAnnotations);
                    }, 1000);
                }
            }
        } else {
            setClosed(false);
            // if(!closed && daysDifference > 30) {
            //     alert("Прогнозирование еще не окончено.\nПосетите страницу результата позже.");
            //     setClosed(true);
            // }
        }
    }, [anno, seg]);

    useEffect(() => {
        if (image !== null){
            const viewer_tmp = initOpenseadragon()
            const annotateState = initializeAnnotations(viewer_tmp)
            viewer_tmp.addHandler('page', handlePageChange);

            // Применяем стили после инициализации
            setTimeout(() => {
                applyAnnotationStyles();
            }, 500);
        }
    },[image]);

    var overlay = false;

    const handleOverlay = () => {
        setTimeout(() => {
            BetterPolygon(anno);
            if(viewer) {
                viewer.addHandler('page', handleAnnotations)
            }
        })
    }

    const handleAnnotations = () => {
        const num = viewer.currentPage()
        anno.clearAnnotations()

        if (tiffanno[num] && tiffanno[num].length > 0) {
            tiffanno[num].forEach(tmp => {
                if (tmp && tmp.id) {
                    anno.addAnnotation(tmp)
                }
            });

            // Применяем стили после загрузки аннотаций
            setTimeout(() => {
                if (tiffanno[num] && tiffanno[num].length > 0) {
                    tiffanno[num].forEach(annotation => {
                        if (annotation && annotation.id) {
                            applyColorToAnnotation(annotation);
                        }
                    });
                }
            }, 100);
        }
    }

    useEffect(() => {
        if(anno) {
            anno.on('createAnnotation', async function (annotation, overrideId) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                const data = Object()
                data.points = []
                for (let item of annotation.body) {
                    if (item.purpose === 'tagging') {
                        data.details = {
                            nodule_type: parseInt(item.value.split(' ')[1]),
                            nodule_2_3: 0,
                            nodule_4: 0,
                            nodule_5: 0,
                            nodule_width: 1,
                            nodule_height: 1,
                            nodule_length: 1
                        }
                    }
                }

                if (tool === 'polygon') {
                    let cur = toGeoJSON(annotation.target.selector.value.split('"')[1])
                    for (let item of cur[0]) {
                        data.points.push({x: parseInt(item[0]), y: parseInt(item[1]), z: viewer.currentPage()})
                    }
                }
                if (tool === "rect") {
                    let cur = annotation.target.selector.value.split(':')[1].split(',')
                    data.points.push({x: parseInt(cur[0]), y: parseInt(cur[1]), z: viewer.currentPage()})
                    data.points.push({
                        x: parseInt(cur[0]) + parseInt(cur[2]),
                        y: parseInt(cur[1]),
                        z: viewer.currentPage()
                    })
                    data.points.push({
                        x: parseInt(cur[0]) + parseInt(cur[2]),
                        y: parseInt(cur[1]) + parseInt(cur[3]),
                        z: viewer.currentPage()
                    })
                    data.points.push({
                        x: parseInt(cur[0]),
                        y: parseInt(cur[1]) + parseInt(cur[3]),
                        z: viewer.currentPage()
                    })
                }
                await axios.post(url + '/uzi/segment/' + imageid + '/', data).then((response) => {
                    overrideId(response.data.id)
                }).catch((response) => {
                })
            });
            anno.on('updateAnnotation', async function (annotation, previous) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                let details = Object()
                for (let item of annotation.body) {
                    if (item.purpose === 'tagging') {
                        details.nodule_type = parseInt(item.value.split(' ')[1])
                    }
                }
                axios.patch(url + '/uzi/segment/' + imageid + '/' + annotation.id).then((response) => {
                        let tmp = Object()
                        tmp.details = response.data.details
                        tmp.details.nodule_type = details.nodule_type
                        axios.put(url + '/uzi/segment/' + imageid + '/' + annotation.id, tmp).then((response) => {
                        })
                    }
                );
            });
            anno.on('deleteAnnotation', async function (annotation) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                await axios.delete(url + '/uzi/segment/' + imageid + '/' + annotation.id).then((response) => {
                })
            });

            // Применяем стили при создании аннотаций
            anno.on('createAnnotation', (annotation) => {
                if (annotation && annotation.id) {
                    setTimeout(() => {
                        applyColorToAnnotation(annotation);
                    }, 100);
                }
            });
        }
    }, [anno])

    useEffect(() => {
        if (viewer){
            handleOverlay()
        }
    }, [viewer])

    const nodeColorInfo = getNodeColorInfo();

    return (
        <div style={{position: 'relative', width: '100%', height: '100%'}}>
            {/* Панель управления справа */}
            <div style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '12px 8px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: '1px solid rgba(0,0,0,0.1)',
                overflowY: 'auto',
                minWidth: '120px',
                minHeight: '400px'
            }}>
                {/* Управление зумом */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={zoomIn}
                        style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            minWidth: '44px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
                    >+
                    </button>

                    <div style={{
                        fontSize: '15px',
                        color: '#666',
                        textAlign: 'center',
                        margin: '2px 0'
                    }}>
                        {Math.round(zoomLevel * 100)}%
                    </div>

                    <button
                        onClick={zoomOut}
                        style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            minWidth: '44px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
                    >-
                    </button>
                </div>

                {/* Разделитель */}
                <div style={{
                    height: '1px',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    margin: '4px 0'
                }}></div>

                {/* Кнопка Fit */}
                <button
                    onClick={fitToScreen}
                    style={{
                        padding: '8px 6px',
                        cursor: 'pointer',
                        backgroundColor: '#FF9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        minWidth: '44px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#F57C00'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#FF9800'}
                >
                    Fit
                </button>

                {/* Разделитель */}
                <div style={{
                    height: '1px',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    margin: '4px 0'
                }}></div>

                {/* Управление поворотом */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={rotateLeft}
                        style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            backgroundColor: '#9C27B0',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            minWidth: '44px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#7B1FA2'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#9C27B0'}
                    >↶
                    </button>

                    <div style={{
                        fontSize: '15px',
                        color: '#666',
                        textAlign: 'center'
                    }}>
                        Поворот
                    </div>

                    <button
                        onClick={rotateRight}
                        style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            backgroundColor: '#9C27B0',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            minWidth: '44px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#7B1FA2'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#9C27B0'}
                    >↷
                    </button>
                </div>

                {/* Разделитель */}
                <div style={{
                    height: '1px',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    margin: '4px 0'
                }}></div>

                {/* Кнопка показа/скрытия сегментов */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center'}}>
                    <button
                        onClick={toggleSegments}
                        style={{
                            padding: '8px 6px',
                            cursor: 'pointer',
                            backgroundColor: showSegments ? '#4CAF50' : '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            minWidth: '100px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = showSegments ? '#388E3C' : '#D32F2F'}
                        onMouseOut={(e) => e.target.style.backgroundColor = showSegments ? '#4CAF50' : '#f44336'}
                    >
                        {showSegments ? 'Скрыть' : 'Показать'}
                    </button>

                    {/* Статус отображения сегментов */}
                    <div style={{
                        fontSize: '15px',
                        textAlign: 'center',
                        color: showSegments ? '#4CAF50' : '#f44336',
                        fontWeight: 'bold'
                    }}>
                        {showSegments ? 'ВКЛ' : 'ВЫКЛ'}
                    </div>
                </div>

                {/* Легенда цветов узлов */}
                {showSegments && nodeColorInfo.length > 0 && (
                    <>
                        <div style={{
                            height: '1px',
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            margin: '4px 0'
                        }}></div>

                        <div style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: '#333',
                            marginBottom: '4px'
                        }}>
                            Узлы:
                        </div>

                        {nodeColorInfo.map((info, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px',
                                color: '#666'
                            }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: info.color,
                                    borderRadius: '2px',
                                    border: '1px solid rgba(0,0,0,0.2)'
                                }}></div>
                                <span>Узел {info.nodeId}</span>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Отображение номера слайда в левом нижнем углу */}
            {totalPages > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    zIndex: 1000,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    border: '2px solid rgba(255,255,255,0.3)'
                }}>
                    Слайд: {currentPage + 1} / {totalPages}
                </div>
            )}

            <div id="openseadragon" style={{width: '100%', height: '100%'}}>
            </div>
        </div>
    );
}

export default OpenSeadragonViewer;