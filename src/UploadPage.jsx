import * as React from 'react';
import '@fontsource/poppins/700.css'

import GlobalStyles from '@mui/material/GlobalStyles';
import {Autocomplete, Button, CircularProgress, createTheme, IconButton, Slide,} from "@mui/material";
import {FormControl} from "@mui/material";

import {MenuItem} from "@mui/material";
import {Box} from "@mui/material";
import {TextField} from "@mui/material";
import {styled} from "@mui/material";

import Grid from '@mui/material/Grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import axios from "axios";
import {Link} from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import {jwtDecode} from "jwt-decode";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';



const theme = createTheme()
export const TextFieldWrapper = styled(TextField)`
    fieldset {
        border-radius: 12px;
        border-color: #E0E0E0;
        border-width: 1px;
    }
    & .MuiOutlinedInput-root {
        &.Mui-focused fieldset {
            border-color: #4FB3EAFF;
            border-width: 2px;
        }
        &:hover fieldset {
            border-color: #4FB3EAFF;
        }
    }
`;
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class UploadPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalImage: "",
            uziDevice: "",
            deviceName:{id: 0, name: ""},
            projectionType: "",
            patientCard: "",
            clicked: false,
            uploadImage: false,
            deviceChosen: false,
            projectionChosen: false,
            patientChosen: false,
            typeText: "Выберите файл в формате .tif, .jpg, .jpeg или .png",
            imageFile: "",
            imageChoosen: false,
            patients: [],
            patientPolicy: null,
            result: false,
            resultid: 0,
            devices: [],
            openSuccess: false,
            openError: false,
            loading: false,
            patient:{id:0, last_name: "", first_name: "", fathers_name:"", personal_policy: ""},
            ref: React.createRef()
        };
    }
    componentDidMount() {
        this.handlePatientList()
        this.handleDevicesList()
    }

    handleUploadFile = (event) => {
        var imageFile = event.target.files[0];
        console.log(imageFile.name)
        const reader = new FileReader();
        reader.readAsDataURL(imageFile)
        reader.addEventListener("load", () => {
            this.setState({
                originalImage: reader.result,
                typeText: imageFile.name,
                imageFile: imageFile,
                imageChoosen: true
            });
            event.target.value = ''
        }, false)
    }
    handleChooseDevice = (object, value) => {
        object.preventDefault()
        var device1 = 0;
        for (let device of this.state.devices) {
            if (device.name === value.name) {
                device1 = device.id;
            }
        }
        this.setState({
            deviceName: {id: value.id, name: value.name},
            uziDevice: device1,
            deviceChosen: true
        });
    };


    handleChooseProjection = (event) => {
        this.setState({
            projectionType: event.target.value,
            projectionChosen: true,
        });
    };

    handleChoosePatient = (object, value) => {
        object.preventDefault()
        var patient1 = 0;
        var patient = null;
        for (patient of this.state.patients) {
            if (patient.data.personal_policy === value.data.personal_policy) {
                patient1 = patient.id;
            }
        }
        this.setState({
            patientCard: patient1,
            patientChosen: true,
            patientPolicy: value.data.personal_policy,
            patient:{id: value.data.id, last_name: value.data.last_name, first_name: value.data.first_name, fathers_name: value.data.fathers_name, personal_policy: value.data.personal_policy}
        });
    };
    handlePatientList = () => {

        const token = localStorage.getItem('access')
        if (token !== null){
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
            axios.get(this.props.url + '/med_worker/patients/'+jwtDecode(typeof localStorage.getItem('access') === "string"? localStorage.getItem('access'):"").user_id)
                .then((response) => {
                        console.log(response)
                        const tmp = []
                        for (let cur of response.data.results.cards){
                            tmp.push({id: cur.id, data: cur.patient})
                        }
                        console.log(tmp)
                        this.setState({
                            patients: tmp
                        })

                    }
                ).catch((er) => {
                console.log(er)
            });
        }

    };
    handleDevicesList = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + "/uzi/devices/?format=json")
            .then((response) => this.setState({devices: response.data.results}))
    };

    handleResult = () => {
        this.setState({
            loading: true
        })
        const formData = new FormData();
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        formData.append("uzi_device", this.state.uziDevice);
        formData.append("projection_type", this.state.projectionType);
        formData.append("patient_card", this.state.patientCard);

        formData.append("original_image", this.state.imageFile);
        const response = axios.post(this.props.url + "/uzi/create/", formData, {timeout: 0}).catch( () => {
                this.setState({
                    openError: true,
                    loading: false
                })
            }
        )
        response.then((response) => {
            console.log(response.data.image_id)
            this.setState({
                resultid: response.data.image_id,
            })
            if (response.data.image_id !== 0){
                this.handleWhat();
                this.setState({
                    uziDevice: null,
                    projectionType: '',
                    patientCard: null,
                    imageFile: null,
                    typeText: "Выберите файл в формате .tif, .jpg, .jpeg или .png",
                    deviceName: {id: 0, name: ""},
                    patient:{id:0, last_name: "", first_name: "", fathers_name:"", personal_policy: ""},
                    deviceChosen: false,
                    projectionChosen: false,
                    patientChosen: false,
                    imageChoosen: false
                })
            }

        })
    };

    handleWhat = () => {
        this.setState({
            result: true,
            openSuccess: true,
            loading: false
        })
    };
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            openSuccess: false,
            openError: false,
        })
    };


    render() {
        return (
            <FormControl fullWidth sx={{position: 'fixed', top: '50%', right: 0, bottom: 0, background: '#f8fdff', alignItems: 'center',  justifyContent: 'center'}}>
                <Snackbar  open={this.state.openSuccess} autoHideDuration={6000} onClose={this.handleClose}
                           TransitionComponent={Slide}
                           action={
                               <IconButton
                                   aria-label="close"
                                   color="inherit"
                                   onClick={this.handleClose}
                               >
                                   <CloseIcon/>
                               </IconButton>}>
                    <Alert severity="success" sx={{width:'100%',backgroundColor: '#00d995'}} onClose={this.handleClose}>Снимок загружен!</Alert>
                </Snackbar>
                <Snackbar  open={this.state.openError} autoHideDuration={6000} onClose={this.handleClose}
                           TransitionComponent={Slide}
                           action={
                               <IconButton
                                   aria-label="close"
                                   color="inherit"
                                   onClick={this.handleClose}
                               >
                                   <CloseIcon/>
                               </IconButton>}>
                    <Alert severity="error" sx={{width:'100%',backgroundColor: '#d9007b'}} onClose={this.handleClose}>Снимок не загружен. Проверьте формат загружаемого файла.</Alert>
                </Snackbar>

                <Box sx={{ minHeight: '100vh', padding: 4 }}>
                    <Grid container spacing={4}>
                        {/* Левая часть - форма */}
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                    border: '1px solid rgba(79, 179, 234, 0.1)',
                                    height: 'fit-content'
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Box className="zero-step" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: '700',
                                                color: '#2c3e50',
                                                mb: 4,
                                                textAlign: 'center',
                                                background: 'linear-gradient(135deg, #4FB3EAFF, #1565C0)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text'
                                            }}
                                        >
                                            Новый снимок УЗИ
                                        </Typography>

                                        {/* Выбор аппарата */}
                                        <Box className='first-step' sx={{ width: '100%', mb: 4 }}>
                                            <FormControl variant={'outlined'} fullWidth>
                                                <Autocomplete
                                                    id="devices"
                                                    options={this.state.devices}
                                                    autoHighlight
                                                    onChange={this.handleChooseDevice}
                                                    value={this.state.deviceName}
                                                    getOptionLabel={(option) => option.name}
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    renderOption={(props, option) => (
                                                        <Box component="li" {...props} sx={{ py: 1 }}>
                                                            <Typography variant="body1">
                                                                {option.name}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextFieldWrapper
                                                            {...params}
                                                            label="Аппарат"
                                                            variant='outlined'
                                                            placeholder="Выберите аппарат"
                                                            inputProps={{
                                                                ...params.inputProps,
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Box>

                                        {/* Выбор проекции */}
                                        <Box className='second-step' sx={{ width: '100%', mb: 4 }}>
                                            <FormControl variant={'outlined'} fullWidth>
                                                <TextFieldWrapper
                                                    value={this.state.projectionType}
                                                    label="Тип проекции"
                                                    onChange={this.handleChooseProjection}
                                                    variant='outlined'
                                                    select
                                                    fullWidth
                                                >
                                                    <MenuItem value={"cross"}>Поперечная</MenuItem>
                                                    <MenuItem value={"long"}>Продольная</MenuItem>
                                                </TextFieldWrapper>
                                            </FormControl>
                                        </Box>

                                        {/* Выбор пациента */}
                                        <Box className='third-step' sx={{ width: '100%', mb: 3 }}>
                                            <FormControl variant={'outlined'} fullWidth>
                                                <Autocomplete
                                                    id="patients"
                                                    options={this.state.patients}
                                                    value={this.state.patient}
                                                    autoHighlight
                                                    disableClearable
                                                    onChange={this.handleChoosePatient}
                                                    getOptionLabel={(option) => option.personal_policy === ""? "" : option.last_name + ' ' + option.first_name + ' ' + option.fathers_name + ' ' + option.personal_policy}
                                                    isOptionEqualToValue={(option, value) => option.personal_policy === value.personal_policy}
                                                    renderOption={(props, option) => (
                                                        <Box component="li" {...props} sx={{ py: 1, width: '100%' }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                                <Box>
                                                                    <Typography variant="body1" fontWeight="500">
                                                                        {option.data.last_name} {option.data.first_name} {option.data.fathers_name}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {option.data.personal_policy}
                                                                    </Typography>
                                                                </Box>
                                                                <IconButton
                                                                    component={Link}
                                                                    to={`/patient/edit/${option.id}`}
                                                                    size="small"
                                                                    sx={{
                                                                        color: '#4FB3EAFF',
                                                                        '&:hover': {
                                                                            backgroundColor: 'rgba(79, 179, 234, 0.1)'
                                                                        }
                                                                    }}
                                                                >
                                                                    <EditIcon fontSize="small"/>
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextFieldWrapper
                                                            {...params}
                                                            label="Пациент"
                                                            variant='outlined'
                                                            placeholder="Выберите пациента"
                                                            inputProps={{
                                                                ...params.inputProps,
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                        </Box>

                                        {/* Кнопка добавления пациента */}
                                        <Box sx={{ width: '100%' }}>
                                            <FormControl fullWidth>
                                                <Button
                                                    className={'third-half-step'}
                                                    component={Link}
                                                    to={`/patient/create`}
                                                    sx={{
                                                        color: '#4FB3EAFF',
                                                        backgroundColor: 'rgba(79, 179, 234, 0.1)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(79, 179, 234, 0.2)',
                                                            transform: 'translateY(-1px)'
                                                        },
                                                        fontFamily: 'Roboto',
                                                        fontWeight: '500',
                                                        textTransform: 'none',
                                                        borderRadius: 2,
                                                        py: 1,
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    variant={'text'}
                                                >
                                                    + Добавить нового пациента
                                                </Button>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Правая часть - загрузка файла */}
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                    border: '1px solid rgba(79, 179, 234, 0.1)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: '600',
                                                color: '#2c3e50',
                                                mb: 2
                                            }}
                                        >
                                            Загрузка снимка
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#7f8c8d',
                                                mb: 3
                                            }}
                                        >
                                            Поддерживаемые форматы: .tif, .jpg, .jpeg, .png
                                        </Typography>
                                    </Box>

                                    {/* Область загрузки файла */}
                                    <Box sx={{ position: 'relative', mb: 3 }}>
                                        <input
                                            type='file'
                                            ref={this.state.ref}
                                            onChange={this.handleUploadFile}
                                            style={{ display: 'none' }}
                                            accept=".tif,.tiff,.jpg,.jpeg,.png"
                                        />
                                        <IconButton
                                            onClick={() => this.state.ref.current.click()}
                                            disabled={!this.state.deviceChosen || !this.state.patientChosen || !this.state.projectionChosen}
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                backgroundColor: this.state.imageChoosen ? 'rgba(0, 217, 149, 0.1)' : 'rgba(79, 179, 234, 0.1)',
                                                border: `2px dashed ${this.state.imageChoosen ? '#00d995' : '#4FB3EAFF'}`,
                                                borderRadius: 3,
                                                '&:hover': {
                                                    backgroundColor: this.state.imageChoosen ? 'rgba(0, 217, 149, 0.2)' : 'rgba(79, 179, 234, 0.2)',
                                                    transform: 'scale(1.05)'
                                                },
                                                '&:disabled': {
                                                    backgroundColor: '#f5f5f5',
                                                    borderColor: '#e0e0e0',
                                                    color: '#bdbdbd'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {this.state.loading ? (
                                                <CircularProgress
                                                    size={40}
                                                    sx={{
                                                        color: '#4FB3EAFF',
                                                    }}
                                                />
                                            ) : (
                                                <CloudUploadIcon
                                                    sx={{
                                                        fontSize: 48,
                                                        color: this.state.imageChoosen ? '#00d995' : '#4FB3EAFF'
                                                    }}
                                                />
                                            )}
                                        </IconButton>
                                    </Box>

                                    {/* Название файла */}
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: this.state.imageChoosen ? '#00d995' : '#bdbdbd',
                                            fontWeight: this.state.imageChoosen ? '500' : 'normal',
                                            textAlign: 'center',
                                            mb: 4,
                                            maxWidth: 300,
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {this.state.typeText}
                                    </Typography>

                                    {/* Кнопки действий */}
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                                        <Button
                                            className={'fifth-step'}
                                            onClick={this.handleResult}
                                            variant={'contained'}
                                            disabled={!this.state.deviceChosen || !this.state.patientChosen || !this.state.projectionChosen || !this.state.imageChoosen}
                                            sx={{
                                                backgroundColor: 'linear-gradient(135deg, #4FB3EAFF, #1565C0)',
                                                background: 'linear-gradient(135deg, #4FB3EAFF, #1565C0)',
                                                color: '#ffffff',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #3a9bc8, #0D47A1)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 25px rgba(79, 179, 234, 0.4)'
                                                },
                                                '&:disabled': {
                                                    background: '#e0e0e0',
                                                    color: '#9e9e9e',
                                                    transform: 'none',
                                                    boxShadow: 'none'
                                                },
                                                fontFamily: 'Roboto',
                                                fontWeight: '600',
                                                padding: '12px 24px',
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                minWidth: 180,
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Провести диагностику
                                        </Button>

                                        <Button
                                            className={'sixth-step'}
                                            component={Link}
                                            to={`/result/${this.state.resultid}`}
                                            variant={'outlined'}
                                            disabled={!this.state.result}
                                            sx={{
                                                color: '#4FB3EAFF',
                                                borderColor: '#4FB3EAFF',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(79, 179, 234, 0.1)',
                                                    borderColor: '#4FB3EAFF',
                                                    transform: 'translateY(-2px)'
                                                },
                                                '&:disabled': {
                                                    color: '#e0e0e0',
                                                    borderColor: '#e0e0e0',
                                                    transform: 'none'
                                                },
                                                fontFamily: 'Roboto',
                                                fontWeight: '600',
                                                padding: '12px 24px',
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                minWidth: 180,
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {this.state.loading && (
                                                <CircularProgress
                                                    size={20}
                                                    sx={{
                                                        marginRight: 1,
                                                        color: '#4FB3EAFF',
                                                    }}
                                                />
                                            )}
                                            Посмотреть результат
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </FormControl>
        )
    }
}

export default UploadPage;