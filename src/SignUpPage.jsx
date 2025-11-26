import * as React from 'react';
import '@fontsource/poppins/700.css'

import GlobalStyles from '@mui/material/GlobalStyles';
import {
    Box,
    Button,
    createTheme,
    FormControl,
    IconButton, InputAdornment,
    InputLabel,
    Slide,
    styled,
    TextField,
} from "@mui/material";

import isEmail from 'validator/lib/isEmail';
import isStrongPassword from "validator/es/lib/isStrongPassword";

import Grid from '@mui/material/Grid';

import axios from "axios";
import {Link, useParams} from 'react-router-dom';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Typography from "@mui/material/Typography";



const SignUpPageInterface = (props) => {
    const {number} = useParams();
    return (
        <SignUpPage props={number} url={props.url}></SignUpPage>
    )
}

const theme = createTheme()
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const TextFieldWrapper = styled(TextField)`
    fieldset {
        border-radius: 12px;
        border-color: #E0E0E0;
        border-width: 1px;
    }
    & .MuiOutlinedInput-root {
        &.Mui-focused fieldset {
            border-color: #1565C0;
            border-width: 2px;
        }
        &:hover fieldset {
            border-color: #1565C0;
        }
    }
`;

class SignUpPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lastName: "",
            lastNameEntered: false,
            firstName: "",
            firstNameEntered: false,
            fathersName: "",
            fathersNameEntered: false,
            email: "",
            emailEntered: false,
            password1: "",
            password1Entered: false,
            password2: "",
            password2Entered: false,
            hospital: "",
            hospitalEntered: false,
            openSuccess: false,
            openError: false,
            showPassword: false
        };
    }
    handleClickShowPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    handleMouseDownPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    handleLastName = (event) => {
        this.setState({
            lastName: event.target.value, lastNameEntered: true,
        });
    };
    handleFirstName = (event) => {
        this.setState({
            firstName: event.target.value, firstNameEntered: true,
        });
    };
    handleFathersName = (event) => {
        this.setState({
            fathersName: event.target.value, fathersNameEntered: true,
        });
    };
    handleEmail = (event) => {
        this.setState({
            email: event.target.value, emailEntered: isEmail(event.target.value),
        });
    };
    handlePassword1 = (event) => {
        this.setState({
            password1: event.target.value,
        });
        this.setState({
            password1Entered: isStrongPassword(event.target.value),
        });
    };
    handlePassword2 = (event) => {
        this.setState({
            password2: event.target.value,
        });
        this.setState({
            password2Entered: isStrongPassword(event.target.value),
        });
    };
    handleHospital = (event) => {
        this.setState({
            hospital: event.target.value,
            hospitalEntered: true,
        });
    };

    // Функция для проверки соответствия паролей
    passwordsMatch = () => {
        return this.state.password1 === this.state.password2 && this.state.password1.length > 0;
    };

    // Функция для проверки силы пароля по кастомным требованиям
    isPasswordStrongEnough = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasSpecialChar = /[-#!$@%^&*_+|=?.,\/]/.test(password);
        const hasMinLength = password.length >= 8;

        return hasUpperCase && hasLowerCase && hasSpecialChar && hasMinLength;
    };

    handleResponse = () => {
        const formData = new FormData();
        formData.append("email", this.state.email);
        formData.append("last_name", this.state.lastName);
        formData.append("first_name", this.state.firstName);
        formData.append("fathers_name", this.state.fathersName);
        formData.append("med_organization", this.state.hospital);
        formData.append("password1", this.state.password1);
        formData.append("password2", this.state.password2);
        axios.post(this.props.url + "/auth/register/", formData,)
            .then(() => this.setState({
                openSuccess: true
            }))
            .catch(() => {
                this.setState({
                    openError: true
                })
            })
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            openSuccess: false, openError: false,
        })
    };

    render() {
        const showPasswordHint = this.state.password1.length > 0 &&
            this.state.password2.length > 0 &&
            this.passwordsMatch() &&
            !this.isPasswordStrongEnough(this.state.password1);

        const showPasswordMismatch = this.state.password1.length > 0 &&
            this.state.password2.length > 0 &&
            !this.passwordsMatch();

        return (
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1565C0 0%, #FF6D00 100%)',
                margin: 0,
                padding: 0,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                overflow: 'auto'
            }}>
                <FormControl fullWidth fullHeight sx={{ margin: 0, padding: 0, height: '100%' }}>
                    <Snackbar open={this.state.openSuccess} autoHideDuration={6000} onClose={this.handleClose}
                              TransitionComponent={Slide}
                              action={<IconButton
                                  aria-label="close"
                                  color="inherit"
                                  onClick={this.handleClose}
                              >
                                  <CloseIcon/>
                              </IconButton>}>
                        <Alert severity="success" sx={{width: '100%', backgroundColor: '#00d995'}}
                               onClose={this.handleClose}
                               action={
                                   <Button component={Link} to={`/sign_in`} sx={{lineHeight: 1.43, marginBlock: 0, fontStyle: {color: '#ffffff'}}} onClick={this.handleClose}>Войти</Button>}>Аккаунт создан!
                        </Alert>
                    </Snackbar>
                    <Snackbar open={this.state.openError} autoHideDuration={6000} onClose={this.handleClose}
                              TransitionComponent={Slide}
                              action={<IconButton
                                  aria-label="close"
                                  color="inherit"
                                  onClick={this.handleClose}
                              >
                                  <CloseIcon/>
                              </IconButton>}>
                        <Alert severity="error" sx={{width: '100%', backgroundColor: '#d9007b'}} onClose={this.handleClose}>Аккаунт не создан</Alert>
                    </Snackbar>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        minHeight: '100vh',
                        margin: 0,
                        padding: 0,
                        width: '100%',
                        height: '100%'
                    }}>
                        {/* Левая часть - форма регистрации */}
                        <Box sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 2,
                            position: 'relative',
                            zIndex: 2,
                            overflow: 'auto'
                        }}>
                            <Box sx={{
                                maxWidth: 450,
                                width: '100%',
                                padding: 4,
                                background: 'white',
                                borderRadius: '24px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                margin: '20px 0'
                            }}>
                                {/* Заголовок формы */}
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: '700',
                                            color: '#2c3e50',
                                            fontSize: '2rem',
                                            mb: 1,
                                            background: 'black',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        Регистрация
                                    </Typography>
                                </Box>

                                {/* Ссылка на вход */}
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Typography
                                        sx={{
                                            color: '#7f8c8d',
                                            display: 'inline',
                                            mr: 1,
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Уже есть аккаунт?
                                    </Typography>
                                    <Button
                                        component={Link}
                                        to={`/sign_in`}
                                        sx={{
                                            textTransform: 'none',
                                            color: '#1565C0',
                                            fontFamily: 'Roboto',
                                            fontWeight: '600',
                                            fontSize: '0.9rem',
                                            padding: '2px 6px',
                                            minWidth: 'auto',
                                            '&:hover': {
                                                backgroundColor: 'rgba(21, 101, 192, 0.1)',
                                                textDecoration: 'none',
                                                borderRadius: '4px'
                                            }
                                        }}
                                        variant='text'
                                    >
                                        Войти
                                    </Button>
                                </Box>

                                {/* Поле Фамилия */}
                                <Box sx={{ mb: 2 }}>
                                    <FormControl fullWidth>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 0.5,
                                                fontWeight: '500',
                                                color: '#2c3e50',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Фамилия <span style={{color: 'red'}}>*</span>
                                        </Typography>
                                        <TextFieldWrapper
                                            error={this.state.lastName.length === 0 && this.state.lastNameEntered}
                                            value={this.state.lastName}
                                            onChange={this.handleLastName}
                                            variant='outlined'
                                            placeholder="Введите вашу фамилию"
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-input': {
                                                    padding: '10px 14px',
                                                    fontSize: '14px'
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Box>

                                {/* Поле Имя */}
                                <Box sx={{ mb: 2 }}>
                                    <FormControl fullWidth>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 0.5,
                                                fontWeight: '500',
                                                color: '#2c3e50',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Имя <span style={{color: 'red'}}>*</span>
                                        </Typography>
                                        <TextFieldWrapper
                                            error={this.state.firstName.length === 0 && this.state.firstNameEntered}
                                            value={this.state.firstName}
                                            onChange={this.handleFirstName}
                                            variant='outlined'
                                            placeholder="Введите ваше имя"
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-input': {
                                                    padding: '10px 14px',
                                                    fontSize: '14px'
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Box>

                                {/* Поле Отчество */}
                                <Box sx={{ mb: 2 }}>
                                    <FormControl fullWidth>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 0.5,
                                                fontWeight: '500',
                                                color: '#2c3e50',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Отчество <span style={{color: 'red'}}>*</span>
                                        </Typography>
                                        <TextFieldWrapper
                                            value={this.state.fathersName}
                                            onChange={this.handleFathersName}
                                            error={this.state.fathersName.length === 0 && this.state.fathersNameEntered}
                                            variant='outlined'
                                            placeholder="Введите ваше отчество"
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-input': {
                                                    padding: '10px 14px',
                                                    fontSize: '14px'
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Box>

                                {/* Поле Мед. организация */}
                                <Box sx={{ mb: 2 }}>
                                    <FormControl fullWidth>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 0.5,
                                                fontWeight: '500',
                                                color: '#2c3e50',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Медицинская организация <span style={{color: 'red'}}>*</span>
                                        </Typography>
                                        <TextFieldWrapper
                                            value={this.state.hospital}
                                            onChange={this.handleHospital}
                                            error={this.state.hospital.length === 0 && this.state.hospitalEntered}
                                            variant='outlined'
                                            placeholder="Введите название медицинской организации"
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-input': {
                                                    padding: '10px 14px',
                                                    fontSize: '14px'
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Box>

                                {/* Поле Email */}
                                <Box sx={{ mb: 2 }}>
                                    <FormControl fullWidth>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 0.5,
                                                fontWeight: '500',
                                                color: '#2c3e50',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Электронная почта <span style={{color: 'red'}}>*</span>
                                        </Typography>
                                        <TextFieldWrapper
                                            value={this.state.email}
                                            onChange={this.handleEmail}
                                            error={!this.state.emailEntered && this.state.email.length !== 0}
                                            variant='outlined'
                                            placeholder="Введите вашу электронную почту"
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-input': {
                                                    padding: '10px 14px',
                                                    fontSize: '14px'
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Box>

                                {/* Поле Пароль */}
                                <Box sx={{ mb: 1 }}>
                                    <FormControl fullWidth>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 0.5,
                                                fontWeight: '500',
                                                color: '#2c3e50',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Пароль <span style={{color: 'red'}}>*</span>
                                        </Typography>
                                        <TextFieldWrapper
                                            value={this.state.password1}
                                            onChange={this.handlePassword1}
                                            error={!this.state.password1Entered && this.state.password1.length !== 0 && this.state.password1 !== this.state.password2}
                                            variant='outlined'
                                            type={this.state.showPassword ? "text" :"password"}
                                            placeholder="Введите пароль"
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-input': {
                                                    padding: '10px 14px',
                                                    fontSize: '14px'
                                                }
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={this.handleClickShowPassword}
                                                            onMouseDown={this.handleMouseDownPassword}
                                                            edge="end"
                                                            sx={{ color: '#1565C0' }}
                                                            size="small"
                                                        >
                                                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </FormControl>
                                </Box>

                                {/* Поле Повторите пароль */}
                                <Box sx={{ mb: 1 }}>
                                    <FormControl fullWidth>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 0.5,
                                                fontWeight: '500',
                                                color: '#2c3e50',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Повторите пароль <span style={{color: 'red'}}>*</span>
                                        </Typography>
                                        <TextFieldWrapper
                                            value={this.state.password2}
                                            onChange={this.handlePassword2}
                                            error={!this.state.password2Entered && this.state.password2.length !== 0 && this.state.password1 !== this.state.password2}
                                            variant='outlined'
                                            type={this.state.showPassword ? "text" :"password"}
                                            placeholder="Повторите пароль"
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-input': {
                                                    padding: '10px 14px',
                                                    fontSize: '14px'
                                                }
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={this.handleClickShowPassword}
                                                            onMouseDown={this.handleMouseDownPassword}
                                                            edge="end"
                                                            sx={{ color: '#1565C0' }}
                                                            size="small"
                                                        >
                                                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </FormControl>
                                </Box>

                                {/* Подсказка о несовпадении паролей */}
                                {showPasswordMismatch && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: '#d32f2f',
                                                fontSize: '0.75rem',
                                                display: 'block',
                                                textAlign: 'left'
                                            }}
                                        >
                                            Пароли не совпадают
                                        </Typography>
                                    </Box>
                                )}

                                {/* Подсказка о требованиях к паролю */}
                                {showPasswordHint && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: '#d32f2f',
                                                fontSize: '0.75rem',
                                                display: 'block',
                                                textAlign: 'left'
                                            }}
                                        >
                                            Пароль должен содержать: заглавную букву, строчную букву, один специальный символ (- # ! $ @ % ^ & * _ + | = ? , . /) и минимум 8 знаков
                                        </Typography>
                                    </Box>
                                )}

                                {/* Кнопка регистрации */}
                                <Box sx={{ mb: 2 }}>
                                    <FormControl fullWidth>
                                        <Button
                                            disabled={!(this.state.lastNameEntered &&
                                                this.state.firstNameEntered && this.state.fathersNameEntered && this.state.emailEntered && this.state.hospitalEntered && this.state.password1Entered && this.state.password2Entered)}
                                            sx={{
                                                color: '#ffffff',
                                                background: 'linear-gradient(135deg, #1565C0, #FF6D00)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #0D47A1, #E65100)',
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: '0 4px 12px rgba(255, 109, 0, 0.3)'
                                                },
                                                '&:disabled': {
                                                    background: '#ecf0f1',
                                                    color: '#bdc3c7',
                                                    transform: 'none',
                                                    boxShadow: 'none'
                                                },
                                                fontFamily: 'Roboto',
                                                fontWeight: '600',
                                                fontSize: '0.9rem',
                                                padding: '10px 24px',
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                boxShadow: '0 2px 8px rgba(255, 109, 0, 0.2)',
                                                transition: 'all 0.3s ease',
                                                height: '44px'
                                            }}
                                            variant={'contained'}
                                            onClick={this.handleResponse}
                                        >
                                            Создать аккаунт
                                        </Button>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Box>

                        {/* Правая часть - информационная */}
                        <Box sx={{
                            flex: 1,
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 4,
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <Box sx={{
                                textAlign: 'left',
                                maxWidth: 900,
                            }}>
                                <Typography
                                    variant='h1'
                                    sx={{
                                        fontSize: '3.5rem',
                                        fontWeight: '800',
                                        fontFamily: "Lato",
                                        color: 'white',
                                        lineHeight: 1.2,
                                        mb: 4,
                                        textShadow: '0 4px 20px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    Интеллектуальный ассистент УЗИ диагностики новообразований щитовидной железы
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </FormControl>
            </Box>
        )
    }
}

export default SignUpPageInterface;