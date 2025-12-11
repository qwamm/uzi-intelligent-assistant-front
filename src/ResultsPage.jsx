import * as React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import {
    Box,
    Button,
    Checkbox, Chip,
    createTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    MenuItem,
    Slide, Stack,
    styled,
    TextField,
} from "@mui/material";
import 'dayjs/locale/ru';
import Grid from '@mui/material/Grid';

import axios from "axios";
import {useParams} from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Gallery from "./Gallery";
import DoneSharpIcon from "@mui/icons-material/DoneSharp";
import Typography from "@mui/material/Typography";
import {Document, Font, Page, PDFDownloadLink, StyleSheet, Text, View} from '@react-pdf/renderer';
import ClearIcon from "@mui/icons-material/Clear";


const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff', display: 'flex'
    },
    russianLight: {
        fontFamily: 'Roboto-light', textOverflow: 'ellipsis', flexWrap: "wrap", paddingRight: 10, margin: 1
    },
    russianMedium: {
        fontFamily: 'Roboto-medium',  textOverflow: 'ellipsis', flexWrap: "wrap", paddingRight: 10, margin: 1
    },
    sectionTitle: {
        textAlign: 'center', margin: 0, paddingTop: 2,
    },
    sectionHeader: {
        textAlign: 'right', margin: 0, paddingTop: 5, paddingRight: 5, width: 200, alignSelf: 'flex-end',
        fontSize: 10, color: '#1520a6',
    },
    sectionEnd: {
        textAlign: 'left', margin: 0, paddingTop: 5, paddingLeft: 10, alignSelf: 'flex-start',
        fontSize: 10,
    },
    sectionPatient: {
        textAlign: 'left', marginBlock: 0, paddingLeft: 10, paddingRight: 10,
        fontSize: 13
    },
    sectionPatient2: {
        textAlign: 'left', marginBlock: 0, paddingLeft: 10, paddingRight: 10,
        fontSize: 13, flexDirection: 'row'
    },
    sectionInfo: {
        textAlign: 'center', marginBlock: 0, paddingTop: 1,
        fontSize: 13, color: '#1520a6',
    },
    sectionPolicy: {
        textAlign: 'left', marginBlock: -10, paddingLeft: 10, justifyContent: 'auto',
        fontSize: 13, flexDirection: 'row'
    },
    sectionSubTitle: {
        textAlign: 'center', margin: 0, paddingTop: 2, fontSize: 15,
    },
    sectionCont: {
        flexDirection: "row",
    },
});
Font.register({
    family: 'Roboto-light',
    src:
        "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
});
Font.register({
    family: 'Roboto-medium',
    src:
        "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
});

const MyDocument = (props) => (
    <Document language={'rus'}>
        <Page size="A4" style={styles.page}>
            <View style={styles.sectionHeader}>
                <Text style={styles.russianLight}>Результат сформирован автоматически виртуальным ассистентом</Text>
            </View>
            <View style={styles.sectionTitle}>
                <Text style={styles.russianMedium}>Результат УЗИ щитовидной железы</Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Пациент: </Text>
                <Text style={styles.russianLight}>{props.patient}</Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Полис: </Text>
                <Text style={styles.russianLight}>{props.policy}</Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Дата приема: </Text>
                <Text style={styles.russianLight}>{props.date}   </Text>
                <Text style={styles.russianMedium}>Аппарат: </Text>
                <Text style={styles.russianLight}>{props.device}   </Text>
                <Text style={styles.russianMedium}>Проекция: </Text>
                <Text style={styles.russianLight}>{props.projection} </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Контуры: </Text>
                <Text style={styles.russianLight}>{props.profile}   </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Общий объем щитовидной железы: </Text>
                <Text style={styles.russianLight}>{props.volume} см³</Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Перешеек: </Text>
                <Text style={styles.russianLight}>{props.isthmus} см</Text>
            </View>
            <View style={styles.sectionSubTitle}>
                <Text style={styles.russianMedium}>Правая доля</Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianMedium}>Размеры: </Text>
                <Text style={styles.russianLight}>Длина - {props.right_length} см, Ширина - {props.right_width} см, Толщина  - {props.right_depth} см, Объем - {props.right_volume} см³  </Text>
            </View>
            <View style={styles.sectionSubTitle}>
                <Text style={styles.russianMedium}>Левая доля</Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianMedium}>Размеры: </Text>
                <Text style={styles.russianLight}>Длина - {props.left_length} см, Ширина - {props.left_width} см, Толщина  - {props.left_depth} см, Объем - {props.left_volume} см³  </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Васкуляризация при ЦДК: </Text>
                <Text style={styles.russianLight}>{props.cdk} </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Расположение: </Text>
                <Text style={styles.russianLight}>{props.position} </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Структура: </Text>
                <Text style={styles.russianLight}>{props.structure} </Text>
            </View>
            <View style={styles.sectionPatient2}>
                <Text style={styles.russianMedium}>Эхогенность: </Text>
                <Text style={styles.russianLight}>{props.echogenicity} </Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianMedium}>Дополнительные данные: </Text>
                <Text style={styles.russianLight}>{props.additional_data} </Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianMedium}>Регионарные лимфатические узлы: </Text>
                <Text style={styles.russianLight}>{props.rln} </Text>
            </View>
            <View style={styles.sectionSubTitle}>
                <Text style={styles.russianMedium}>Тип новообразования по мнению ассистента: </Text>
            </View>
            <View style={styles.sectionInfo}>
                <Text style={styles.russianLight}>{props.predictedTypes}</Text>
            </View>
            <View style={styles.sectionSubTitle}>
                <Text style={styles.russianMedium}>Заключение</Text>
            </View>
            <View style={styles.sectionPatient}>
                <Text style={styles.russianLight}>{props.segmentation_summary} </Text>
            </View>
            <View style={styles.sectionCont}>
                <View style={styles.sectionEnd}>
                    <Text style={styles.russianMedium}>Врач:</Text>
                    <Text style={styles.russianLight}>{props.doctorName} </Text>
                    <Text style={styles.russianLight}>{props.medOrg} </Text>
                </View>
                <View style={styles.sectionEnd}>
                    <Text style={styles.russianMedium}>Дата:</Text>
                    <Text style={styles.russianLight}>{new Date().toLocaleDateString()} </Text>
                </View>
                <View style={styles.sectionEnd}>
                    <Text style={styles.russianMedium}>Подпись:</Text>
                    <Text style={styles.russianLight}> </Text>
                    <Text style={styles.russianLight}>________________________ </Text>
                </View>
            </View>
        </Page>
    </Document>
);

const theme = createTheme();

// Стилизованные кнопки
const PrimaryButton = styled(Button)({
    backgroundColor: '#4FB3EA',
    color: '#FFFFFF',
    padding: '12px 24px',
    borderRadius: '12px',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: 'Roboto, sans-serif',
    boxShadow: '0 4px 12px rgba(79, 179, 234, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        backgroundColor: '#3A9BD6',
        boxShadow: '0 6px 20px rgba(79, 179, 234, 0.4)',
        transform: 'translateY(-2px)',
    },
    '&:active': {
        transform: 'translateY(0)',
        boxShadow: '0 2px 10px rgba(79, 179, 234, 0.3)',
    },
    '&:disabled': {
        backgroundColor: '#E0E0E0',
        color: '#9E9E9E',
        boxShadow: 'none',
    },
});

const OutlineButton = styled(Button)({
    color: '#4FB3EA',
    backgroundColor: 'transparent',
    border: '2px solid #4FB3EA',
    borderRadius: '12px',
    padding: '12px 24px',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: 'Roboto, sans-serif',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        backgroundColor: 'rgba(79, 179, 234, 0.08)',
        borderColor: '#3A9BD6',
        color: '#3A9BD6',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(79, 179, 234, 0.15)',
    },
    '&:active': {
        transform: 'translateY(0)',
    },
});

const SecondaryButton = styled(Button)({
    color: '#FFFFFF',
    backgroundColor: '#00D995',
    borderRadius: '12px',
    padding: '12px 24px',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: 'Roboto, sans-serif',
    boxShadow: '0 4px 12px rgba(0, 217, 149, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        backgroundColor: '#00C585',
        boxShadow: '0 6px 20px rgba(0, 217, 149, 0.4)',
        transform: 'translateY(-2px)',
    },
    '&:active': {
        transform: 'translateY(0)',
    },
});

export const TextFieldResult = styled(TextField)`
    fieldset {
        border-radius: 10px;
        border-color: #4FB3EAFF;
        border-width: 1px;
    }

,
'& label': marginLeft: "100%",
`;

function BootstrapDialogTitle(props) {
    const {children, onClose, ...other} = props;

    return (
        <DialogTitle sx={{
            width: '100%',
            padding: '28px 32px 20px',
            backgroundColor: '#F8FBFF',
            borderBottom: '1px solid #E3F2FD',
            borderRadius: '24px 24px 0 0',
            position: 'relative'
        }} {...other}>
            <Typography variant="h5" component="div" sx={{
                color: '#194964',
                fontWeight: 600,
                fontSize: '24px',
                fontFamily: 'Roboto',
                letterSpacing: '-0.5px',
            }}>
                {children}
            </Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 24,
                        top: 24,
                        color: '#90A4AE',
                        backgroundColor: 'rgba(144, 164, 174, 0.08)',
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        '&:hover': {
                            backgroundColor: 'rgba(144, 164, 174, 0.12)',
                            color: '#546E7A',
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}


const ResultsPageInterface = (props) => {
    const {number} = useParams();
    return (
        <ResultsPage props={number} url={props.url}></ResultsPage>
    )
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


class ResultsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalImage: "",
            segmentation: null,
            uziDevice: {id: 2, name: 'Logic'},
            projectionType: "long",
            patientCard: 1,
            uziDate: new Date(),
            tiradsType: [],
            predictedTypes: new Set([]),
            shortResult: false,
            cdk: "не изменена",
            diagnosis: "",
            echogenicity: "средняя",
            isthmus: 0,
            left_depth: 0,
            left_length: 0,
            left_width: 0,
            position: "обычное",
            contours: "чёткие, ровные",
            projection_type: "long",
            result: "без динамики",
            right_depth: 0,
            right_length: 0,
            right_width: 0,
            rln: "нет",
            structure: "однородная",
            uziVolume: null,
            longResult: null,
            clicked: false,
            uploadImage: false,
            deviceChosen: false,
            projectionChosen: false,
            patientChosen: false,
            patients: [],
            patientPolicy: null,
            startData: null,
            patientLastName: "",
            patientFirstName: "",
            patientFathersName: "",
            imageChoosen: false,
            linkEditingImage: "",
            openSuccess: false,
            devices: [],
            open: false,
            left_volume: 0,
            right_volume: 0,
            volume: 0,
            additional_data: "",
            openError: false,
            doctorName: '',
            medOrg: '',
            date: new Date(),
            imageId: 1,
            nodule_amount: 0,
            checked: false,
            typesForReport: [],
            doctorTiradsType: [],
            doctorTypes: new Set([]),
            aiTypes: new Set([]),
            expanded_info: false,
            slide_template: [],
            image_count: 0,
            segmented_area_total: 0, // Новая переменная для общей площади сегментированных областей
            nodule_details: [] // Детали узлов для отображения
        }
    }

    componentDidMount() {
        this.handleStartPage();
        this.handleDoctor();
    }

    handleDoctor = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url+ '/med_worker/update/' + localStorage.getItem('id')).then((response) => {
            this.setState({
                doctorName: response.data.last_name+" "+ response.data.first_name+" "+response.data.fathers_name,
                medOrg: (response.data.med_organization === null||response.data.med_organization ===''?'Место работы не указано':response.data.med_organization) +",\n"+ (response.data.job === null||response.data.job ===''?'должность не указана':response.data.job)
            })
        })
    };

    handleResponse = () => {
        this.handleExport();
    };

    // Функция для расчета площади сегментированной области
    calculateSegmentedArea = (segmentationData) => {
        if (!segmentationData || segmentationData.length === 0) {
            return 0;
        }

        let totalArea = 0;
        const noduleDetails = [];

        // Для каждого сегмента рассчитываем площадь
        segmentationData.forEach((segment, index) => {
            // Получаем размеры узла из деталей
            const width = segment.details?.nodule_width || 1;
            const length = segment.details?.nodule_length || 1;

            // Расчет площади (предполагаем эллиптическую форму)
            // Площадь эллипса = π * a * b, где a и b - полуоси
            const area = Math.PI * (width / 2) * (length / 2);

            totalArea += area;

            noduleDetails.push({
                index: index + 1,
                type: segment.details?.nodule_type || 0,
                width: width,
                length: length,
                height: segment.details?.nodule_height || 1,
                area: area,
                is_ai: segment.is_ai || false
            });
        });

        return { totalArea, noduleDetails };
    };

    getSegmentationSummary = () => {
        const { segmentation } = this.state;

        if (!segmentation || segmentation.length === 0) {
            return "";
        }

        const PIXEL_SIZE_CM = 0.005; // Размер пикселя в см

        let summary = "Обнаружены узловые образования щитовидной железы:\n\n";
        let totalVolume = 0;

        segmentation.forEach((segment, index) => {
            const points = segment.data?.[0]?.points || [];
            const details = segment.details || {};
            const noduleType = details.nodule_type || 0;

            if (points.length === 0) {
                summary += `Узел ${index + 1}: данные контура отсутствуют, TI-RADS ${noduleType}\n\n`;
                return;
            }

            const areaPixels = this.calculatePolygonArea(points);
            const areaCm2 = areaPixels * (PIXEL_SIZE_CM * PIXEL_SIZE_CM);

            const { widthPixels, lengthPixels } = this.calculateNoduleDimensions(points);
            const widthCm = widthPixels * PIXEL_SIZE_CM;
            const lengthCm = lengthPixels * PIXEL_SIZE_CM;

            const thicknessCm = this.estimateNoduleThickness(widthCm, lengthCm, areaCm2);

            const volumeCm3 = (2*Math.PI / 3) * widthCm * lengthCm * thicknessCm;

            totalVolume += volumeCm3;

            summary += `Узел ${index + 1}: ${widthCm.toFixed(2)}×${lengthCm.toFixed(2)}×${thicknessCm.toFixed(2)} см\n`;
            summary += `   Объём: ${volumeCm3.toFixed(2)} см³\n`;
            summary += `   TI-RADS: ${noduleType}\n`;

            if (segment.is_ai) {
                const tirads23 = details.nodule_2_3 || 0;
                const tirads4 = details.nodule_4 || 0;
                const tirads5 = details.nodule_5 || 0;

                if (tirads23 > 0 || tirads4 > 0 || tirads5 > 0) {
                    summary += `   Классы новообразований, определенные ассистентом:: `;
                    if (tirads23 > 0) summary += `TI-RADS 2-3: ${(tirads23 * 100).toFixed(1)}% `;
                    if (tirads4 > 0) summary += `TI-RADS 4: ${(tirads4 * 100).toFixed(1)}% `;
                    if (tirads5 > 0) summary += `TI-RADS 5: ${(tirads5 * 100).toFixed(1)}%`;
                    summary += `\n`;
                }
            }

            summary += `\n`;
        });

        summary += `Количество узлов: ${segmentation.length}\n`;
        summary += `Общий объем узлов: ${totalVolume.toFixed(2)} см³\n`;

        if (totalVolume === 0) {
            summary += `- Узловые образования отсутствуют\n`;
        } else if (totalVolume < 1) {
            summary += `- Общий объем узлов ${totalVolume.toFixed(2)} см³ (незначительный)\n`;
            summary += `- УЗ-признаки диффузно очаговых изменений щитовидной железы. Рекомендовано динамическое наблюдение\n`;
        } else if (totalVolume < 5) {
            summary += `- Общий объем узлов ${totalVolume.toFixed(2)} см³ (умеренный)\n`;
            summary += `- УЗ-признаки диффузно очаговых изменений щитовидной железы. Рекомендовано УЗИ-контроль через 6-12 месяцев\n`;
        } else {
            summary += `- Общий объем узлов ${totalVolume.toFixed(2)} см³ (значительный)\n`;
            summary += `- УЗ-признаки диффузно очаговых изменений щитовидной железы. Рекомендована консультация эндокринолога, биопсия по показаниям\n`;
        }

        if (this.state.total_nodule_volume !== totalVolume) {
            this.setState({
                total_nodule_volume: totalVolume
            });
        }

        return summary;
    };

// Расчет площади многоугольника по координатам вершин
    calculatePolygonArea = (points) => {
        if (!points || points.length < 3) return 0;

        let area = 0;
        const n = points.length;

        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            area += points[i].x * points[j].y;
            area -= points[j].x * points[i].y;
        }

        return Math.abs(area) / 2;
    };

    // Расчет длины и ширины узла
    calculateNoduleDimensions = (points) => {
        if (!points || points.length === 0) {
            return { widthPixels: 0, lengthPixels: 0 };
        }

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        points.forEach(point => {
            if (point.x < minX) minX = point.x;
            if (point.x > maxX) maxX = point.x;
            if (point.y < minY) minY = point.y;
            if (point.y > maxY) maxY = point.y;
        });

        const widthPixels = maxX - minX;
        const lengthPixels = maxY - minY;

        return { widthPixels, lengthPixels };
    };

    //TODO: подумать как сделать более точный расчт толщины узлов
    estimateNoduleThickness = (widthCm, lengthCm, areaCm2) => {
        if (widthCm <= 0 || lengthCm <= 0) return 0;


        const smallerDimension = Math.min(widthCm, lengthCm);

        let thickness;

        if (areaCm2 > 0) {
            thickness = smallerDimension * 0.7;
        } else {
            thickness = smallerDimension * 0.8;
        }

        return Math.max(0.2, Math.min(thickness, 3.0));
    };

    // calculateSegmentedAreaAndVolume = (segmentationData) => {
    //     if (!segmentationData || segmentationData.length === 0) {
    //         return { totalArea: 0, totalVolume: 0, noduleDetails: [] };
    //     }
    //
    //     const PIXEL_SIZE_CM = 0.015;
    //     let totalArea = 0;
    //     let totalVolume = 0;
    //     const noduleDetails = [];
    //
    //     segmentationData.forEach((segment, index) => {
    //         const points = segment.data?.[0]?.points || [];
    //         const details = segment.details || {};
    //
    //         if (points.length === 0) {
    //             noduleDetails.push({
    //                 index: index + 1,
    //                 type: details.nodule_type || 0,
    //                 width: 0,
    //                 length: 0,
    //                 height: 0,
    //                 area: 0,
    //                 volume: 0,
    //                 is_ai: segment.is_ai || false
    //             });
    //             return;
    //         }
    //
    //         const areaPixels = this.calculatePolygonArea(points);
    //         const areaCm2 = areaPixels * (PIXEL_SIZE_CM * PIXEL_SIZE_CM);
    //
    //         const { widthPixels, lengthPixels } = this.calculateNoduleDimensions(points);
    //         const widthCm = widthPixels * PIXEL_SIZE_CM;
    //         const lengthCm = lengthPixels * PIXEL_SIZE_CM;
    //
    //         const thicknessCm = this.estimateNoduleThickness(widthCm, lengthCm, areaCm2);
    //
    //         const volumeCm3 = (Math.PI / 6) * widthCm * lengthCm * thicknessCm;
    //
    //         totalArea += areaCm2;
    //         totalVolume += volumeCm3;
    //
    //         noduleDetails.push({
    //             index: index + 1,
    //             type: details.nodule_type || 0,
    //             width: widthCm,
    //             length: lengthCm,
    //             height: thicknessCm,
    //             area: areaCm2,
    //             volume: volumeCm3,
    //             is_ai: segment.is_ai || false,
    //             tirads_2_3: details.nodule_2_3 || 0,
    //             tirads_4: details.nodule_4 || 0,
    //             tirads_5: details.nodule_5 || 0,
    //             point_count: points.length
    //         });
    //     });
    //
    //     return {
    //         totalArea,
    //         totalVolume,
    //         noduleDetails
    //     };
    // };

    handleStartPage = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + "/uzi/" + this.props.props + "/?format=json")
            .then((response) => {
                this.setState({startData: response.data.info});

                // Получаем список устройств
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
                axios.get(this.props.url + "/uzi/devices/?format=json")
                    .then((res) => {
                        this.setState({devices: res.data.results});
                        const tmp = res.data.results;
                        for (let cur of tmp) {
                            if (cur.name === response.data.info.uzi_device_name) {
                                this.setState({
                                    uziDevice: cur
                                });
                            }
                        }
                    });

                // Обработка данных сегментации
                let segmentationData = response.data.segmentation;

                // Если segmentation не массив, преобразуем в массив
                if (segmentationData && !Array.isArray(segmentationData)) {
                    segmentationData = [segmentationData];
                }

                // Расчет площади сегментированных областей
                const { totalArea, noduleDetails } = this.calculateSegmentedArea(segmentationData || []);

                // Расчет объемов с округлением
                const rightDepth = response.data.info.details?.right_depth || 0;
                const rightLength = response.data.info.details?.right_length || 0;
                const rightWidth = response.data.info.details?.right_width || 0;
                const leftDepth = response.data.info.details?.left_depth || 0;
                const leftLength = response.data.info.details?.left_length || 0;
                const leftWidth = response.data.info.details?.left_width || 0;

                const rightVolume = 0.479 * rightDepth * rightLength * rightWidth;
                const leftVolume = 0.479 * leftDepth * leftLength * leftWidth;
                const totalVolume = rightVolume + leftVolume;

                // Обработка типов TI-RADS
                let ar = [false, false, false, false, false];
                let ar2 = [false, false, false, false, false];
                let arr = [];
                const aiTypes = new Set();
                const doctorTypes = new Set();

                if (segmentationData && segmentationData.length > 0) {
                    segmentationData.forEach((item) => {
                        if(!item.is_ai){
                            doctorTypes.add(item);
                        } else {
                            aiTypes.add(item);
                        }

                        const noduleType = item.details?.nodule_type || 0;
                        if(noduleType >= 1 && noduleType <= 5) {
                            if(!item.is_ai){
                                ar2[noduleType - 1] = true;
                            } else {
                                ar[noduleType - 1] = true;
                            }
                        }
                        arr.push(`TI-RADS ${noduleType} ${!item.is_ai?'- подтверждено врачом':'- определил ассистент'}`);
                    });
                }

                this.setState({
                    slide_template: response.data.image?.slide_template || [],
                    image_count: response.data.image?.image_count || 0,
                    uziDate: new Date(response.data.info.diagnos_date),
                    predictedTypes: segmentationData || [],
                    nodule_amount: segmentationData ? segmentationData.length : 0,
                    segmentation: segmentationData,
                    patientCard: response.data.info.patient?.id || 1,
                    patientPolicy: response.data.info.patient?.personal_policy || "",
                    patientLastName: response.data.info.patient?.last_name || "",
                    patientFirstName: response.data.info.patient?.first_name || "",
                    patientFathersName: response.data.info.patient?.fathers_name || "",
                    projectionType: response.data.info.details?.projection_type !== undefined ? response.data.info.details.projection_type : 'long',
                    longResult: response.data.info.echo_descr || "",
                    originalImage: response.data.image?.image || "",
                    shortResult: response.data.info.has_nodules === 'T',
                    cdk: response.data.info.details?.cdk || "не изменена",
                    diagnosis: response.data.info.diagnosis || "",
                    echogenicity: response.data.info.details?.echogenicity || "средняя",
                    isthmus: response.data.info.details?.isthmus || 0,
                    left_depth: leftDepth,
                    left_length: leftLength,
                    left_width: leftWidth,
                    position: response.data.info.details?.position || "обычное",
                    profile: response.data.info.details?.profile || "чёткие, ровные",
                    result: response.data.info.details?.result || "без динамики",
                    right_depth: rightDepth,
                    right_length: rightLength,
                    right_width: rightWidth,
                    rln: response.data.info.details?.rln || "нет",
                    structure: response.data.info.details?.structure || "однородная",
                    additional_data: response.data.info.details?.additional_data || "",
                    imageId: response.data.image?.id || 1,
                    right_volume: !isNaN(rightVolume) ? rightVolume : 0,
                    left_volume: !isNaN(leftVolume) ? leftVolume : 0,
                    volume: !isNaN(totalVolume) ? totalVolume : 0,
                    segmented_area_total: totalArea,
                    nodule_details: noduleDetails,
                    tiradsType: ar,
                    typesForReport: arr,
                    doctorTiradsType: ar2,
                    aiTypes: aiTypes,
                    doctorTypes: doctorTypes,
                    checked: doctorTypes.size > 0
                });
            })
            .catch(error => {
                console.error("Error loading data:", error);
            });
    };

    handleExport = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;

        const formData = {
            patient_card: {
                patient: this.state.patientCard,
                has_nodules: this.state.shortResult ? 'T' : 'F',
                diagnosis: this.state.diagnosis
            },
            acceptance_datetime: this.state.uziDate,
            details: {
                projection_type: this.state.projectionType,
                nodule_type: this.state.tiradsType,
                cdk: this.state.cdk,
                echogenicity: this.state.echogenicity,
                isthmus: this.state.isthmus,
                left_depth: this.state.left_depth,
                left_length: this.state.left_length,
                left_width: this.state.left_width,
                position: this.state.position,
                profile: this.state.profile,
                result: this.state.result,
                right_depth: this.state.right_depth,
                right_length: this.state.right_length,
                right_width: this.state.right_width,
                rln: this.state.rln,
                structure: this.state.structure,
                additional_data: this.state.additional_data
            },
            uzi_device: this.state.uziDevice.id
        };

        axios.put(this.props.url + "/uzi/" + this.props.props + '/update/', formData)
            .then(() => {
                this.setState({ openSuccess: true });
            })
            .catch(() => {
                this.setState({ openError: true });
            });
    };

    // Обновленные обработчики для расчета объемов с округлением
    handleLeft_depth = (event) => {
        const value = parseFloat(event.target.value) || 0;
        const leftVolume = 0.479 * value * this.state.left_length * this.state.left_width;
        const totalVolume = leftVolume + this.state.right_volume;

        this.setState({
            left_depth: value,
            left_volume: leftVolume,
            volume: totalVolume,
        });
    }

    handleLeft_length = (event) => {
        const value = parseFloat(event.target.value) || 0;
        const leftVolume = 0.479 * this.state.left_depth * value * this.state.left_width;
        const totalVolume = leftVolume + this.state.right_volume;

        this.setState({
            left_length: value,
            left_volume: leftVolume,
            volume: totalVolume,
        });
    }

    handleLeft_width = (event) => {
        const value = parseFloat(event.target.value) || 0;
        const leftVolume = 0.479 * this.state.left_depth * this.state.left_length * value;
        const totalVolume = leftVolume + this.state.right_volume;

        this.setState({
            left_width: value,
            left_volume: leftVolume,
            volume: totalVolume,
        });
    }

    handleRight_depth = (event) => {
        const value = parseFloat(event.target.value) || 0;
        const rightVolume = 0.479 * value * this.state.right_length * this.state.right_width;
        const totalVolume = rightVolume + this.state.left_volume;

        this.setState({
            right_depth: value,
            right_volume: rightVolume,
            volume: totalVolume,
        });
    }

    handleRight_length = (event) => {
        const value = parseFloat(event.target.value) || 0;
        const rightVolume = 0.479 * this.state.right_depth * value * this.state.right_width;
        const totalVolume = rightVolume + this.state.left_volume;

        this.setState({
            right_length: value,
            right_volume: rightVolume,
            volume: totalVolume,
        });
    }

    handleRight_width = (event) => {
        const value = parseFloat(event.target.value) || 0;
        const rightVolume = 0.479 * this.state.right_depth * this.state.right_length * value;
        const totalVolume = rightVolume + this.state.left_volume;

        this.setState({
            right_width: value,
            right_volume: rightVolume,
            volume: totalVolume,
        });
    }

    handleCdk = (event) => {
        this.setState({
            cdk: event.target.value
        });
    }

    handleDiagnosis = (event) => {
        this.setState({
            diagnosis: event.target.value
        });
    }

    handleEchogenicity = (event) => {
        this.setState({
            echogenicity: event.target.value
        });
    }

    handleIsthmus = (event) => {
        this.setState({
            isthmus: event.target.value
        });
    }

    handleNoduleAmount = (event) => {
        const newSegmentation = [...(this.state.segmentation || [])];
        newSegmentation.push({
            details: {
                nodule_type: 3,
                nodule_2_3: 1,
                nodule_4: 0,
                nodule_5: 0,
                nodule_height: 1,
                nodule_length: 1,
                nodule_width: 1
            }
        });

        // Пересчет площади
        const { totalArea, noduleDetails } = this.calculateSegmentedArea(newSegmentation);

        this.setState({
            nodule_amount: newSegmentation.length,
            segmentation: newSegmentation,
            segmented_area_total: totalArea,
            nodule_details: noduleDetails
        });
    }

    handleNoduleAmount2 = () => {
        const newSegmentation = [...(this.state.segmentation || [])];
        if (newSegmentation.length > 0) {
            newSegmentation.pop();

            // Пересчет площади
            const { totalArea, noduleDetails } = this.calculateSegmentedArea(newSegmentation);

            this.setState({
                nodule_amount: newSegmentation.length,
                segmentation: newSegmentation,
                segmented_area_total: totalArea,
                nodule_details: noduleDetails
            });
        }
    }
    handlePosition = (event) => {
        this.setState({
            position: event.target.value
        });
    }

    handleProfile = (event) => {
        this.setState({
            profile: event.target.value
        });
    }

    handleAdditional_data = (event) => {
        this.setState({
            additional_data: event.target.value
        });
    }

    handleResult = (event) => {
        this.setState({
            result: event.target.value
        });
    }

    handleRln = (event) => {
        this.setState({
            rln: event.target.value
        });
    }

    handleStructure = (event) => {
        this.setState({
            structure: event.target.value
        });
    }

    handleChooseTirads = (event) => {
        this.setState({
            tiradsType: event.target.value,
        });
    };

    handleChooseShortResult = () => {
        this.setState({
            shortResult: !this.state.shortResult,
        });
    };

    handleChooseDevice = (event) => {
        this.setState({
            uziDevice: event.target.value,
            deviceChosen: true
        });
    };

    handleChooseProjection = (event) => {
        this.setState({
            projectionType: event.target.value,
            projectionChosen: true,
        });
    };

    handleCloseDialog = () => {
        this.setState({
            open: false
        });
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            openSuccess: false,
            openError: false,
        });
    };

    handleDialog = () => {
        this.setState({
            open: true
        });
    };

    // Метод для получения цветов для каждого узла
    getNoduleColor = (index) => {
        const colors = [
            '#4fb3ea', // синий
            '#00d995', // зеленый
            '#d9007b', // розовый
            '#ff9800', // оранжевый
            '#9c27b0', // фиолетовый
            '#f44336', // красный
            '#4caf50', // зеленый
            '#2196f3', // голубой
            '#ffeb3b', // желтый
            '#795548'  // коричневый
        ];
        return colors[index % colors.length];
    };

    render() {
        // Форматирование значений для PDF
        const formattedLeftVolume = this.state.left_volume.toFixed(2);
        const formattedRightVolume = this.state.right_volume.toFixed(2);
        const formattedTotalVolume = this.state.volume.toFixed(2);
        const formattedSegmentedArea = this.state.segmented_area_total.toFixed(2);
        const segmentationSummary = this.getSegmentationSummary();

        return (
            <FormControl sx={{height: '100%', width: '100%'}}>
                <Snackbar open={this.state.openSuccess} autoHideDuration={6000} onClose={this.handleClose}
                          TransitionComponent={Slide}
                          action={
                              <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  onClick={this.handleClose}
                              >
                                  <CloseIcon/>
                              </IconButton>}>
                    <Alert severity="success" sx={{width: '100%', backgroundColor: '#00d995'}}
                           onClose={this.handleClose}>Результат сохранен!</Alert>
                </Snackbar>
                <Snackbar open={this.state.openError} autoHideDuration={6000} onClose={this.handleClose}
                          TransitionComponent={Slide}
                          action={
                              <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  onClick={this.handleClose}
                              >
                                  <CloseIcon/>
                              </IconButton>}>
                    <Alert severity="error" sx={{width: '100%', backgroundColor: '#d9007b'}}
                           onClose={this.handleClose}>Возникла ошибка при сохранении</Alert>
                </Snackbar>
                <Box component={""} sx={{
                    backgroundColor: '#ffffff',
                    paddingLeft: 15,
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderTopLeftRadius: 130,
                    height: 'auto',
                    minHeight: 600,
                    width: 'auto',
                    minWidth: 500,
                    '&:hover': {
                        backgroundColor: "#ffffff",
                    },
                }} color={theme.palette.secondary.contrastText}>
                    <Grid component={""} container direction={'column'} alignContent={'center'} justifyContent={'center'} sx={{marginBlock: -1}}>
                        <Grid component={""} item>
                            <Box className={'second-step'} component={""} sx={{flexDirection: 'column'}}>
                                <FormGroup>
                                    <FormControlLabel label={this.state.checked?"Проверено специалистом":"Не проверено специалистом"} disabled
                                                      sx={{color: 'dimgray', fontWeight: 'lighter'}}
                                                      labelPlacement="end"
                                                      control={<Checkbox checked={this.state.checked} sx={{
                                                          color: 'dimgray', '&.Mui-checked': {
                                                              color: '#4fb3ea',
                                                          }
                                                      }} icon={<ClearIcon/>}
                                                                         checkedIcon={<DoneSharpIcon/>}
                                                      />}/>
                                </FormGroup>
                            </Box>
                            <Grid component={""} item className={'first-step'}>
                                <Box component={""} sx={{width: 500}} display={'flex'}>
                                    <GlobalStyles styles={{
                                        h6: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: 'normal',
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd: 0,
                                            marginInlineEnd: 5,
                                        },
                                        h3: {
                                            color: 'dimgray',
                                            fontSize: 20,
                                            fontFamily: "Roboto",
                                            fontWeight: "lighter",
                                            whiteSpace: 'normal',
                                            marginBlockStart: 0,
                                            marginBlockEnd: 0,
                                        }
                                    }}/>
                                    <h3 style={{
                                        color: 'dimgray',
                                        fontSize: 20,
                                        fontFamily: "Roboto",
                                        fontWeight: 'normal',
                                        whiteSpace: 'normal',
                                        marginBlockStart: 0,
                                        marginBlockEnd: 0,
                                        marginInlineEnd: 5,
                                    }}>Пациент: </h3>
                                    <h3>  {this.state.patientLastName} {this.state.patientFirstName} {this.state.patientFathersName}</h3>
                                </Box>
                            </Grid>
                            <Grid component={""} item className={'first-step'}>
                                <Box component={""} sx={{width: 500}} display={'flex'}>
                                    <h3 style={{
                                        color: 'dimgray',
                                        fontSize: 20,
                                        fontFamily: "Roboto",
                                        fontWeight: 'normal',
                                        whiteSpace: 'normal',
                                        marginBlockStart: 0,
                                        marginBlockEnd: 0,
                                        marginInlineEnd: 5,
                                    }}>Полис: </h3>
                                    <h3>  {this.state.patientPolicy}</h3>
                                </Box>
                            </Grid>
                            <Stack className={'third-step'} direction="row" sx={{paddingTop: 1}}>
                                <h3 style={{
                                    color: 'dimgray',
                                    fontSize: 20,
                                    fontFamily: "Roboto",
                                    fontWeight: 'normal',
                                    whiteSpace: 'normal',
                                }}>Дата: </h3>
                                <h3>  {this.state.uziDate.toLocaleDateString()}</h3>
                            </Stack>
                            <Box className={'fourth-step'}>
                                <Stack direction={'column'}>
                                    <Button sx={{color: '#4fb3ea', textTransform: 'none'}} disabled={true}>
                                        <h3 style={{
                                            color: 'dimgray',
                                            fontSize: 15,
                                            fontFamily: "Roboto",
                                            fontWeight: 'normal',
                                            whiteSpace: 'normal',
                                            marginBlockStart: 4.5,
                                            marginInlineEnd: 5,
                                        }}>Типы новообразований, определенные ассистентом: </h3>
                                    </Button>

                                    {/* Отображение узлов, определенных ассистентом */}
                                    <Stack direction="column" spacing={1} sx={{paddingTop: 1}}>
                                        {Array.from(this.state.aiTypes).map((data, index) => (
                                            <Stack key={index} direction="row" alignItems="center" spacing={1}>
                                                <Chip
                                                    label={`Узел ${index + 1}`}
                                                    sx={{
                                                        backgroundColor: this.getNoduleColor(index),
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        minWidth: 80
                                                    }}
                                                />
                                                <Chip
                                                    label={`TI-RADS ${data.details?.nodule_type || 0}`}
                                                    sx={{
                                                        color: '#4fb3ea',
                                                        borderColor: '#4fb3ea',
                                                        fontWeight: 'bold'
                                                    }}
                                                    variant="outlined"
                                                />
                                                <Typography variant="body2" sx={{ color: 'dimgray', ml: 1 }}>
                                                    (TI-RADS 2-3: {((data.details?.nodule_2_3 || 0) * 100).toFixed(1)}%,
                                                    TI-RADS 4: {((data.details?.nodule_4 || 0) * 100).toFixed(1)}%,
                                                    TI-RADS 5: {((data.details?.nodule_5 || 0) * 100).toFixed(1)}%)
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Stack>

                                {/*<Stack direction={'column'}>*/}
                                {/*    <Button sx={{ textTransform: 'none'}} disabled={true}>*/}
                                {/*        <h3 style={{*/}
                                {/*            color: 'dimgray',*/}
                                {/*            fontSize: 15,*/}
                                {/*            fontFamily: "Roboto",*/}
                                {/*            fontWeight: 'normal',*/}
                                {/*            whiteSpace: 'normal',*/}
                                {/*            marginBlockStart: 4.5,*/}
                                {/*            marginInlineEnd: 5,*/}
                                {/*        }}>Типы новообразований, определенные специалистом: </h3>*/}
                                {/*    </Button>*/}
                                {/*    */}
                                {/*    <Stack direction="column" spacing={1} sx={{paddingTop: 1}}>*/}
                                {/*        {Array.from(this.state.doctorTypes).map((data, index) => (*/}
                                {/*            <Stack key={index} direction="row" alignItems="center" spacing={1}>*/}
                                {/*                <Chip*/}
                                {/*                    label={`Узел ${index + 1}`}*/}
                                {/*                    sx={{*/}
                                {/*                        backgroundColor: this.getNoduleColor(index),*/}
                                {/*                        color: 'white',*/}
                                {/*                        fontWeight: 'bold',*/}
                                {/*                        minWidth: 80*/}
                                {/*                    }}*/}
                                {/*                />*/}
                                {/*                <Chip*/}
                                {/*                    label={`TI-RADS ${data.details?.nodule_type || 0}`}*/}
                                {/*                    sx={{*/}
                                {/*                        borderColor: '#194964',*/}
                                {/*                        backgroundColor: '#194964',*/}
                                {/*                        color: 'white',*/}
                                {/*                        fontWeight: 'bold'*/}
                                {/*                    }}*/}
                                {/*                    variant="filled"*/}
                                {/*                />*/}
                                {/*                <Typography variant="body2" sx={{ color: 'dimgray', ml: 1, fontStyle: 'italic' }}>*/}
                                {/*                    (подтверждено специалистом)*/}
                                {/*                </Typography>*/}
                                {/*            </Stack>*/}
                                {/*        ))}*/}
                                {/*    </Stack>*/}
                                {/*</Stack>*/}
                            </Box>
                        </Grid>
                        <Grid component={""} item alignItems={'center'} justifyContent={'center'} sx={{paddingTop: 0}}>
                            <Gallery url={this.props.url} props={this.props.props} link1={this.state.originalImage} date={this.state.uziDate} image_count={this.state.image_count} slide_template={this.state.slide_template}
                                     number={this.props.props} type={this.state.tiradsType} seg={this.state.segmentation} imageid={this.state.imageId}></Gallery>
                        </Grid>
                        <Box className={'seventh-step'} component={""} sx={{display: 'flex', flexDirection: 'row', paddingTop: 2}}>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                    <FormControl variant={'outlined'} fullWidth>
                                        <TextFieldResult
                                            InputLabelProps={{shrink: true}}
                                            value={this.state.uziDevice}
                                            label="Аппарат"
                                            onChange={this.handleChooseDevice}
                                            variant='outlined'
                                            select
                                        >
                                            {this.state.devices.map((data, index) =>
                                                <MenuItem key={data.id} value={data}>
                                                    {data.name}
                                                </MenuItem>

                                            )}
                                        </TextFieldResult>
                                    </FormControl>
                                </Box>
                            </Box>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                    <FormControl variant={'outlined'} fullWidth>
                                        <TextFieldResult
                                            InputLabelProps={{shrink: true}}
                                            value={this.state.projectionType}
                                            label="Тип проекции"
                                            onChange={this.handleChooseProjection}
                                            variant='outlined'
                                            defaultValue={this.state.projectionType}
                                            select
                                        >
                                            <MenuItem value={'long'}>Продольная</MenuItem>
                                            <MenuItem value={'cross'}>Поперечная</MenuItem>
                                        </TextFieldResult>
                                    </FormControl>
                                </Box>
                            </Box>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 1, paddingLeft: 2}}>
                                <FormGroup>

                                    <FormControlLabel label={"Обнаружено новообразование"}
                                                      sx={{color: 'dimgray', fontWeight: 'lighter'}}
                                                      labelPlacement="end"
                                                      control={<Checkbox checked={this.state.shortResult} sx={{
                                                          color: 'dimgray', '&.Mui-checked': {
                                                              color: '#4fb3ea',
                                                          }
                                                      }} icon={<DoneSharpIcon/>}
                                                                         checkedIcon={<DoneSharpIcon/>}
                                                                         onChange={this.handleChooseShortResult}
                                                      />}/>
                                </FormGroup>
                                <Box component={""} sx={{
                                    width: 300,
                                    borderRadius: 3,
                                    paddingTop: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignContent: 'center'
                                }}>
                                    <OutlineButton
                                        onClick={this.handleDialog}
                                        sx={{width: '100%'}}
                                    >
                                        Эхографические признаки
                                    </OutlineButton>
                                </Box>
                                <Dialog
                                    PaperProps={{
                                        sx: {
                                            borderRadius: '24px',
                                            width: '800px',
                                            maxWidth: '90vw',
                                            maxHeight: '85vh',
                                            overflow: 'hidden',
                                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                                            border: '1px solid #E3F2FD'
                                        }
                                    }}
                                    open={this.state.open}
                                    onClose={this.handleCloseDialog}
                                    aria-describedby="alert-dialog-slide-description"
                                    BackdropProps={{
                                        style: {
                                            backgroundColor: 'rgba(25, 73, 100, 0.4)',
                                            backdropFilter: 'blur(4px)'
                                        }
                                    }}
                                >
                                    <BootstrapDialogTitle onClose={this.handleCloseDialog}>
                                        Эхографические признаки
                                    </BootstrapDialogTitle>

                                    <DialogContent sx={{
                                        padding: '24px 32px',
                                        backgroundColor: '#FFFFFF'
                                    }}>
                                        <DialogContentText
                                            id="alert-dialog-slide-description"
                                            sx={{
                                                fontFamily: 'Roboto',
                                                fontWeight: 400,
                                                color: '#607D8B',
                                                fontSize: '14px',
                                                marginBottom: '24px',
                                                lineHeight: 1.6
                                            }}
                                        >
                                            Заполните необходимые поля для описания эхографических признаков
                                        </DialogContentText>

                                        <Box component={""} sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.profile}
                                                        label="Контуры"
                                                        onChange={this.handleProfile}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{display: 'flex', flexDirection: 'row', gap: 2}}>
                                                <Box component={""} sx={{display: 'flex', flexDirection: 'column', flex: 1}}>
                                                    <Typography component={""} sx={{
                                                        paddingTop: 1,
                                                        color: '#194964',
                                                        fontWeight: 600,
                                                        fontSize: '16px'
                                                    }} variant={'body1'}>Левая доля</Typography>
                                                    <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 1}}>
                                                        <FormControl variant={'outlined'} fullWidth>
                                                            <TextFieldResult
                                                                value={this.state.left_length}
                                                                label="Длина (см)"
                                                                onChange={this.handleLeft_length}
                                                                variant='outlined'
                                                                InputLabelProps={{shrink: true}}
                                                            >
                                                            </TextFieldResult>
                                                        </FormControl>
                                                    </Box>
                                                    <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 1}}>
                                                        <FormControl variant={'outlined'} fullWidth>
                                                            <TextFieldResult
                                                                value={this.state.left_width}
                                                                label="Ширина (см)"
                                                                onChange={this.handleLeft_width}
                                                                variant='outlined'
                                                                InputLabelProps={{shrink: true}}
                                                            >
                                                            </TextFieldResult>
                                                        </FormControl>
                                                    </Box>
                                                    <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 1}}>
                                                        <FormControl variant={'outlined'} fullWidth>
                                                            <TextFieldResult
                                                                value={this.state.left_depth}
                                                                label="Толщина (см)"
                                                                onChange={this.handleLeft_depth}
                                                                variant='outlined'
                                                                InputLabelProps={{shrink: true}}
                                                            >
                                                            </TextFieldResult>
                                                        </FormControl>
                                                    </Box>
                                                    <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 1}}>
                                                        <FormControl variant={'outlined'} fullWidth>
                                                            <TextFieldResult
                                                                value={formattedLeftVolume}
                                                                label="Объем (см³)"
                                                                variant='outlined'
                                                                InputLabelProps={{shrink: true}}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                }}
                                                            >
                                                            </TextFieldResult>
                                                        </FormControl>
                                                    </Box>
                                                </Box>
                                                <Box component={""} sx={{display: 'flex', flexDirection: 'column', flex: 1}}>
                                                    <Typography component={""} sx={{
                                                        paddingTop: 1,
                                                        color: '#194964',
                                                        fontWeight: 600,
                                                        fontSize: '16px'
                                                    }} variant={'body1'}>Правая доля</Typography>
                                                    <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 1}}>
                                                        <FormControl variant={'outlined'} fullWidth>
                                                            <TextFieldResult
                                                                value={this.state.right_length}
                                                                label="Длина (см)"
                                                                onChange={this.handleRight_length}
                                                                variant='outlined'
                                                                InputLabelProps={{shrink: true}}
                                                            >
                                                            </TextFieldResult>
                                                        </FormControl>
                                                    </Box>
                                                    <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 1}}>
                                                        <FormControl variant={'outlined'} fullWidth>
                                                            <TextFieldResult
                                                                value={this.state.right_width}
                                                                label="Ширина (см)"
                                                                onChange={this.handleRight_width}
                                                                variant='outlined'
                                                                InputLabelProps={{shrink: true}}
                                                            >
                                                            </TextFieldResult>
                                                        </FormControl>
                                                    </Box>
                                                    <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 1}}>
                                                        <FormControl variant={'outlined'} fullWidth>
                                                            <TextFieldResult
                                                                value={this.state.right_depth}
                                                                label="Толщина (см)"
                                                                onChange={this.handleRight_depth}
                                                                variant='outlined'
                                                                InputLabelProps={{shrink: true}}
                                                            >
                                                            </TextFieldResult>
                                                        </FormControl>
                                                    </Box>
                                                    <Box component={""} sx={{width: '100%', borderRadius: 3, paddingTop: 1}}>
                                                        <FormControl variant={'outlined'} fullWidth>
                                                            <TextFieldResult
                                                                value={formattedRightVolume}
                                                                label="Объем (см³)"
                                                                variant='outlined'
                                                                InputLabelProps={{shrink: true}}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                }}
                                                            >
                                                            </TextFieldResult>
                                                        </FormControl>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        value={formattedTotalVolume}
                                                        label="Объем железы (см³)"
                                                        variant='outlined'
                                                        InputLabelProps={{shrink: true}}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.isthmus}
                                                        label="Перешеек (см)"
                                                        onChange={this.handleIsthmus}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.structure}
                                                        label="Структура"
                                                        onChange={this.handleStructure}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.echogenicity}
                                                        label="Эхогенность"
                                                        onChange={this.handleEchogenicity}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.rln}
                                                        label="Регионарные лимфатические узлы"
                                                        onChange={this.handleRln}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.cdk}
                                                        label="Васкуляризация по ЦДК"
                                                        onChange={this.handleCdk}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.position}
                                                        label="Расположение"
                                                        onChange={this.handlePosition}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.additional_data}
                                                        label="Дополнительные данные"
                                                        onChange={this.handleAdditional_data}
                                                        variant='outlined'
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                            <Box component={""} sx={{width: '100%', borderRadius: 3}}>
                                                <FormControl variant={'outlined'} fullWidth>
                                                    <TextFieldResult
                                                        InputLabelProps={{shrink: true}}
                                                        value={this.state.diagnosis}
                                                        label="Заключение"
                                                        onChange={this.handleDiagnosis}
                                                        variant='outlined'
                                                        multiline
                                                        rows={3}
                                                    >
                                                    </TextFieldResult>
                                                </FormControl>
                                            </Box>
                                        </Box>
                                    </DialogContent>
                                    <DialogActions sx={{
                                        padding: '20px 32px 28px',
                                        backgroundColor: '#F8FBFF',
                                        borderTop: '1px solid #E3F2FD',
                                        gap: 2
                                    }}>
                                        <Button
                                            onClick={this.handleCloseDialog}
                                            sx={{
                                                color: '#607D8B',
                                                textTransform: 'none',
                                                fontWeight: 500,
                                                padding: '10px 24px',
                                                borderRadius: '10px',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(144, 164, 174, 0.08)',
                                                }
                                            }}
                                        >
                                            Отмена
                                        </Button>
                                        <SecondaryButton
                                            key="save-btn"
                                            onClick={() => {
                                                this.handleExport();
                                                this.handleCloseDialog();
                                            }}
                                        >
                                            Сохранить изменения
                                        </SecondaryButton>
                                    </DialogActions>
                                </Dialog>
                            </Box>
                            <Box component={""} sx={{flexDirection: 'column', paddingTop: 2, paddingLeft: 2}}>
                                <Box component={""} sx={{width: 300, borderRadius: 3, paddingBottom: 2}}>
                                    <Box component={""} sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        <PrimaryButton
                                            sx={{width: '100%'}}
                                            onClick={this.handleResponse}
                                        >
                                            Сохранить результат
                                        </PrimaryButton>
                                        <PDFDownloadLink
                                            key="pdf-link"
                                            document={
                                                <MyDocument
                                                    patient={this.state.patientLastName + " " + this.state.patientFirstName + " " + this.state.patientFathersName}
                                                    policy={this.state.patientPolicy}
                                                    date={new Date(Date.parse(this.state.uziDate)).toLocaleDateString()}
                                                    projection={this.state.projectionType === 'long' ? 'Продольная' : "Поперечная"}
                                                    device={this.state.uziDevice.name}
                                                    tiradsType={this.state.tiradsType}
                                                    predictedTypes={this.state.typesForReport.toString().replaceAll(',', ", ")}
                                                    cdk={this.state.cdk}
                                                    diagnosis={this.state.diagnosis}
                                                    echogenicity={this.state.echogenicity}
                                                    isthmus={this.state.isthmus.toFixed(2)}
                                                    left_depth={this.state.left_depth.toFixed(2)}
                                                    left_length={this.state.left_length.toFixed(2)}
                                                    left_width={this.state.left_width.toFixed(2)}
                                                    position={this.state.position}
                                                    profile={this.state.profile}
                                                    result={this.state.result}
                                                    right_depth={this.state.right_depth.toFixed(2)}
                                                    right_length={this.state.right_length.toFixed(2)}
                                                    right_width={this.state.right_width.toFixed(2)}
                                                    rln={this.state.rln}
                                                    structure={this.state.structure}
                                                    left_volume={formattedLeftVolume}
                                                    right_volume={formattedRightVolume}
                                                    volume={formattedTotalVolume}
                                                    additional_data={this.state.additional_data}
                                                    doctorName={this.state.doctorName}
                                                    medOrg={this.state.medOrg}
                                                    nodule_count={this.state.nodule_amount}
                                                    segmented_area={formattedSegmentedArea}
                                                    segmentation_summary={segmentationSummary}
                                                />
                                            }
                                            fileName={"Result_"+this.state.date.toLocaleDateString().replaceAll(".", "_")+"_"+this.state.patientLastName+".pdf"}
                                            style={{textDecoration: 'none', width: '100%'}}
                                        >
                                            {({ loading}) =>
                                                (loading ? "loading" :
                                                        <OutlineButton sx={{width: '100%'}}>
                                                            Скачать заключение
                                                        </OutlineButton>
                                                )}
                                        </PDFDownloadLink>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Box>
            </FormControl>
        )
    }
}

export default ResultsPageInterface;