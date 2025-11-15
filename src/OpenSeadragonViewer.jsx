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

    const viewerRef = useRef(null);
    const annoRef = useRef(null);

    console.log('Image:', image);
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
            formatter
        });

        annotateState.setDrawingTool('polygon');
        SelectorPack(annotateState);

        annoRef.current = annotateState;
        setAnno(annotateState);

        return annotateState;
    };

    // Функция для обновления аннотаций на текущей странице
    const updateAnnotationsForPage = (pageIndex) => {
        if (!annoRef.current || !tiffanno.length) {
            return;
        }

        console.log(`Updating annotations for page ${pageIndex}`);

        annoRef.current.clearAnnotations();

        if (tiffanno[pageIndex] && tiffanno[pageIndex].length > 0) {
            tiffanno[pageIndex].forEach(annotation => {
                try {
                    annoRef.current.addAnnotation(annotation);
                } catch (error) {
                    console.error('Error adding annotation:', error);
                }
            });
        }
    };

    // Обработчик смены страницы
    const handlePageChange = (data) => {
        const newPage = data.page;
        console.log('Page changed to:', newPage);
        setCurrentPage(newPage);
        updateAnnotationsForPage(newPage);
    };

// Подготовка аннотаций для всех страниц
    const prepareAnnotations = () => {
        console.log('Preparing annotations for all pages...');

        const annotations = Array.from({ length: image.length }, () => []);

        if (seg && seg.length > 0) {
            console.log(`Processing ${seg.length} segments`);

            seg.forEach((segment) => {
                if (segment.data && segment.data.length > 0) {
                    segment.data.forEach((contour) => {
                        if (contour.points && contour.points.length > 0) {

                            // Группируем точки по координате z
                            const pointsByPage = {};

                            contour.points.forEach(point => {
                                const pageIndex = point.z || 0;
                                if (!pointsByPage[pageIndex]) {
                                    pointsByPage[pageIndex] = [];
                                }
                                pointsByPage[pageIndex].push(point);
                            });

                            console.log('POINTS BY PAGE', pointsByPage);

                            // Создаем отдельную аннотацию для каждой группы точек с одинаковым z
                            Object.entries(pointsByPage).forEach(([pageIndexStr, points]) => {
                                const pageIndex = parseInt(pageIndexStr);

                                if (pageIndex >= annotations.length) {
                                    console.warn(`Page index ${pageIndex} exceeds available pages ${annotations.length}`);
                                    return;
                                }

                                try {
                                    // Преобразуем точки в SVG формат
                                    const coord = points.map(point => [point.x, point.y]);
                                    const svgPoints = fromGeoJSON(coord).toString();
                                    const svgSelector = `<svg><polygon points="${svgPoints}"></polygon></svg>`;

                                    // Создаем аннотацию
                                    const annotation = {
                                        type: "Annotation",
                                        body: [
                                            {
                                                type: "TextualBody",
                                                value: `TI-RADS 2-3: ${Number((segment.details?.nodule_2_3 * 100) || 0).toFixed(1)}%\n\nTI-RADS 4: ${Number((segment.details?.nodule_4 * 100) || 0).toFixed(1)}%\n\nTI-RADS 5: ${Number((segment.details?.nodule_5 * 100) || 0).toFixed(1)}%`,
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
                                                value: segment.id.toString(),
                                                purpose: "group"
                                            },
                                            {
                                                type: "TextualBody",
                                                value: segment.is_ai ? "AI" : "Doctor result",
                                                purpose: "tagging"
                                            },
                                        ],
                                        target: {
                                            source: image[pageIndex]?.url || "http://localhost:3000/result/undefined",
                                            selector: {
                                                type: "SvgSelector",
                                                value: svgSelector,
                                            }
                                        },
                                        "@context": "http://www.w3.org/ns/anno.jsonld",
                                        id: `${contour.id}_${pageIndex}` // Уникальный ID для каждой аннотации
                                    };

                                    annotations[pageIndex].push(annotation);
                                    console.log(`Added annotation to page ${pageIndex} with ${points.length} points`);

                                } catch (error) {
                                    console.error('Error creating annotation:', error);
                                }
                            });
                        }
                    });
                }
            });
        }

        console.log('Final annotations structure:',
            annotations.map((arr, idx) => `Page ${idx}: ${arr.length} annotations`));

        setTiffAnno(annotations);
        return annotations;
    };

    // Функция для поиска страницы с аннотациями
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

    useEffect(() => {
        if (annoRef.current) {
            annoRef.current.setDrawingTool(tool);
        }
    }, [tool]);

    useEffect(() => {
        const date1 = new Date();
        const date2 = new Date(date);
        const timestamp1 = date1.getTime();
        const timestamp2 = date2.getTime();
        const difference = timestamp1 - timestamp2;
        const daysDifference = Math.floor(difference / (1000 * 60));

        console.log('Разница в минутах:', daysDifference);

        if (seg !== null && seg.length !== 0) {
            const annotations = prepareAnnotations();

            // Если аннотации уже инициализированы, обновляем текущую страницу
            if (annoRef.current && viewerRef.current) {
                const currentPage = viewerRef.current.currentPage();
                updateAnnotationsForPage(currentPage);

                // Автоматически переключаемся на страницу с аннотациями
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

            if(!closed && daysDifference > 30) {
                alert("Прогнозирование еще не окончено.\nПосетите страницу результата позже.");
                setClosed(true);
            }
        }
    }, [anno, seg]);

    const formatter = (annotation) => {
        const isA = annotation.bodies.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 1'
        });
        const isB = annotation.bodies.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 2'
        });
        const isC = annotation.bodies.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 3'
        });
        const isD = annotation.bodies.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 4'
        });
        const isE = annotation.bodies.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 5'
        });
        const isAI = annotation.bodies.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'ai'
        });
        const isDOC = annotation.bodies.find(b => {
            return b.purpose === 'tagging' && b.value.toLowerCase() === 'doctor result'
        });
        if (isDOC) {
            const isDOCA = annotation.bodies.find(b => {
                return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 1'
            });
            const isDOCB = annotation.bodies.find(b => {
                return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 2'
            });
            const isDOCC = annotation.bodies.find(b => {
                return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 3'
            });
            const isDOCD = annotation.bodies.find(b => {
                return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 4'
            });
            const isDOCE = annotation.bodies.find(b => {
                return b.purpose === 'tagging' && b.value.toLowerCase() === 'ti-rads 5'
            });
            if (isDOCA) {
                return 'DOC-A';
            }
            if (isDOCB) {
                return 'DOC-B';
            }
            if (isDOCC) {
                return 'DOC-C';
            }
            if (isDOCD) {
                return 'DOC-D';
            }
            if (isDOCE) {
                return 'DOC-E';
            }
            return 'DOC';
        }
        if (isA) {
            return 'A';
        }
        if (isB) {
            return 'B';
        }
        if (isC) {
            return 'C';
        }
        if (isD) {
            return 'D';
        }
        if (isE) {
            return 'E';
        }
    }

    useEffect(() => {
        //console.log(image)
        if (image !== null){
            const viewer_tmp = initOpenseadragon()
            initializeAnnotations(viewer_tmp)

            // Добавляем обработчик смены страницы
            viewer_tmp.addHandler('page', handlePageChange);
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
        //console.log(anno.getAnnotations())
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleAnnotations = () => {
        const num = viewer.currentPage()
        anno.clearAnnotations()
        for (let tmp of tiffanno[num]) {
            anno.addAnnotation(tmp)
        }
    }
    useEffect(() => {
        if(anno) {
            anno.on('createAnnotation', async function (annotation, overrideId) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                //console.log(annotation)
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
                    //console.log(cur)
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
                    //console.log(data.points)
                }
                //console.log(data)
                //console.log(url + '/uzi/segment/' + imageId)
                await axios.post(url + '/uzi/segment/' + imageid + '/', data).then((response) => {
                    // console.log(response)
                    overrideId(response.data.id)
                }).catch((response) => {
                    // console.log(response)
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

                // if (tool === 'polygon') {
                //     let cur = toGeoJSON(annotation.target.selector.value.split('"')[1])
                //     console.log(cur)
                //     for (let item of cur[0]) {
                //         data.points.push({x: parseInt(item[0]), y: parseInt(item[1]), z: viewer.currentPage()})
                //     }
                // }
                axios.patch(url + '/uzi/segment/' + imageid + '/' + annotation.id).then((response) => {
                        //console.log(response.data)
                        let tmp = Object()
                        tmp.details = response.data.details
                        tmp.details.nodule_type = details.nodule_type
                        axios.put(url + '/uzi/segment/' + imageid + '/' + annotation.id, tmp).then((response) => {
                            // console.log(response.data)
                        })
                    }
                );
            });
            anno.on('deleteAnnotation', async function (annotation) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                //console.log(url + '/uzi/segment/' + imageId + '/' + annotation.id)
                await axios.delete(url + '/uzi/segment/' + imageid + '/' + annotation.id).then((response) => {
                    // console.log(response.data)
                })
            });
        }
    }, [anno])


    useEffect(() => {
        if (viewer){
            handleOverlay()
        }
    }, [viewer])

    return (
        <div>
            <div id="openseadragon">
            </div>
        </div>

    );
}

export default OpenSeadragonViewer;