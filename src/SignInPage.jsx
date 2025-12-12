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

import axios from "axios";
import {Link, useParams} from 'react-router-dom';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Typography from "@mui/material/Typography";



const SignInPageInterface = (props) => {
    const {number} = useParams();
    return (

        <SignInPage props={number} url={props.url} setSignIn={props.setSignIn}></SignInPage>

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

class SignInPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            emailEntered: false,
            password: "",
            passwordEntered: false,
            openSuccess: false,
            openError: false,
            showPassword: false,
            success: false
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

    handleEmail = (event) => {
        this.setState({
            email: event.target.value, emailEntered: true,
        });
    };
    handlePassword = (event) => {
        this.setState({
            password: event.target.value,
            passwordEntered: true,
        });
    };



    handleResponse = () => {
        const formData = new FormData();
        formData.append("email", this.state.email);
        formData.append("password", this.state.password);
        axios.post(this.props.url + "/auth/login/", formData)
            .then((response) => {
                this.setState({
                    openSuccess: true,
                    success: true
                })
                localStorage.setItem('refresh', response.data.refresh)
                localStorage.setItem('access', response.data.access)
                this.props.setSignIn(false)
                var link = document.createElement('a');
                link.href = '/home';
                link.click();
                document.body.removeChild(link);
            })
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
                               onClose={this.handleClose}>Вход выполнен успешно!</Alert>
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
                        <Alert severity="error" sx={{width: '100%', backgroundColor: '#d9007b'}} onClose={this.handleClose}>Не удается войти в аккаунт</Alert>
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
                        {/* Левая часть - форма входа */}
                        <Box sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 4,
                            position: 'relative',
                            zIndex: 2
                        }}>
                            <Box sx={{
                                maxWidth: 450,
                                width: '100%',
                                padding: 6,
                                background: 'white',
                                borderRadius: '24px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                            }}>
                                {/* Заголовок формы */}
                                <Box sx={{ textAlign: 'center', mb: 6 }}>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: '700',
                                            color: '#2c3e50',
                                            fontSize: '2.5rem',
                                            mb: 2,
                                            background: 'black',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        Вход в систему
                                    </Typography>
                                </Box>

                                {/* Поле email */}
                                <Box sx={{ mb: 4 }}>
                                    <FormControl fullWidth>
                                        <TextFieldWrapper
                                            value={this.state.email}
                                            onChange={this.handleEmail}
                                            variant='outlined'
                                            placeholder="Введите вашу электронную почту"
                                            sx={{
                                                marginBlockStart: 1,
                                                '& .MuiOutlinedInput-input': {
                                                    padding: '16px 20px',
                                                    fontSize: '16px'
                                                }
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box sx={{
                                                            color: '#1565C0',
                                                            fontSize: '20px',
                                                            mr: 1
                                                        }}>
                                                            ✉️
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </FormControl>
                                </Box>

                                {/* Поле пароля */}
                                <Box sx={{ mb: 4 }}>
                                    <FormControl fullWidth>
                                        <TextFieldWrapper
                                            value={this.state.password}
                                            onChange={this.handlePassword}
                                            variant='outlined'
                                            type={this.state.showPassword ? "text" :"password"}
                                            placeholder="Введите ваш пароль"
                                            sx={{
                                                marginBlockStart: 1,
                                                '& .MuiOutlinedInput-input': {
                                                    padding: '16px 20px',
                                                    fontSize: '16px'
                                                }
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box sx={{
                                                            color: '#1565C0',
                                                            fontSize: '20px',
                                                            mr: 1
                                                        }}>
                                                            🔒
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={this.handleClickShowPassword}
                                                            onMouseDown={this.handleMouseDownPassword}
                                                            edge="end"
                                                            sx={{ color: '#1565C0' }}
                                                        >
                                                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </FormControl>
                                </Box>

                                {/* Кнопка входа */}
                                <Box sx={{ mb: 4 }}>
                                    <FormControl fullWidth>
                                        <Button
                                            disabled={!(this.state.emailEntered && this.state.passwordEntered && this.state.email.length !== 0 && this.state.password.length)}
                                            sx={{
                                                color: '#ffffff',
                                                background: 'linear-gradient(135deg, #1565C0, #FF6D00)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #0D47A1, #E65100)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 25px rgba(255, 109, 0, 0.4)'
                                                },
                                                '&:disabled': {
                                                    background: '#ecf0f1',
                                                    color: '#bdc3c7',
                                                    transform: 'none',
                                                    boxShadow: 'none'
                                                },
                                                fontFamily: 'Roboto',
                                                fontWeight: '600',
                                                fontSize: '1.1rem',
                                                padding: '16px 32px',
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                boxShadow: '0 4px 15px rgba(255, 109, 0, 0.3)',
                                                transition: 'all 0.3s ease',
                                                height: '56px'
                                            }}
                                            variant={'contained'}
                                            onClick={this.handleResponse}
                                        >
                                            Войти в систему
                                        </Button>
                                    </FormControl>
                                </Box>

                                {/* Ссылка на регистрацию */}
                                <Box sx={{
                                    textAlign: 'center',
                                    paddingTop: 3
                                }}>
                                    <Typography
                                        sx={{
                                            color: '#7f8c8d',
                                            display: 'inline',
                                            mr: 1
                                        }}
                                    >
                                        Нет учетной записи?
                                    </Typography>
                                    <Button
                                        component={Link}
                                        to={`/sign_up`}
                                        sx={{
                                            textTransform: 'none',
                                            color: '#1565C0',
                                            fontFamily: 'Roboto',
                                            fontWeight: '600',
                                            fontSize: '1rem',
                                            padding: '4px 8px',
                                            minWidth: 'auto',
                                            '&:hover': {
                                                backgroundColor: 'rgba(21, 101, 192, 0.1)',
                                                textDecoration: 'none',
                                                borderRadius: '6px'
                                            }
                                        }}
                                        variant='text'
                                    >
                                        Зарегистрироваться
                                    </Button>
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
                                        textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                        textAlign: 'center'
                                    }}
                                >
                                    Интеллектуальный ассистент врача ультразвуковой диагностики узловых образований щитовидной железы «Второе мнение» по ТУ 58.29.32-001-02066569-2025
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </FormControl>
            </Box>
        )
    }
}

export default SignInPageInterface;