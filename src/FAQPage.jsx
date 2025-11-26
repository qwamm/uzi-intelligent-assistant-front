import * as React from 'react';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import Typography from '@mui/material/Typography';
import { Accordion, AccordionDetails, AccordionSummary, Box } from "@mui/material";

export default function CustomizedAccordions() {
    const [expanded, setExpanded] = React.useState(null);

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <Box sx={{ paddingTop: '30px' }}>
        <Box
            sx={{
                padding: { xs: 4, md: 10 },
                height: 'auto',
                width: 'auto',
                maxWidth: 1200,
                maxHeight: 700,
                margin: '0 auto',
            }}
        >
            <Typography
                variant={'h3'}
                align={'center'}
                fontWeight={'600'}
                fontFamily={'"Inter", "Helvetica Neue", Arial, sans-serif'}
                color={'#2d3748'}
                sx={{
                    mb: 6,
                    fontSize: { xs: '1.8rem', md: '2.5rem' },
                    background: 'linear-gradient(135deg, #2292cb 0%, #2d3748 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    letterSpacing: '-0.02em'
                }}
            >
                Как использовать ассистента?
            </Typography>

            {[
                {
                    id: 'panel1',
                    question: 'Как войти в систему?',
                    answer: 'Для входа в систему воспользуйтесь выданными эл. почтой и паролем.'
                },
                {
                    id: 'panel2',
                    question: 'Как создать новый аккаунт?',
                    answer: `Для того, чтобы создать новый аккаунт, Вам необходимо сначала войти с выданными данными для авторизации: эл. почтой и паролем. После этого вы можете нажать на опцию "Выйти" и создать новый аккаунт. Для этого под полями ввода эл.почты и пароля на странице "Войти" необходимо выбрать режим "Зарегистрироваться". Для создания аккаунта обязательно заполнение всех полей формы и создание надежного пароля.`
                },
                {
                    id: 'panel3',
                    question: 'Как загрузить новый снимок?',
                    answer: `Для загрузки нового снимка перейдите в раздел "Добавить снимок".\n\nВ данном разделе необходимо заполнить все поля. Для лучшего результата выберите наиболее подходящий аппарат УЗИ и тип проекции.\n\nСнимок можно присвоить стандартному пациенту, который будет находиться в списке первым. Если Вы хотите сразу занести результат в карту определенного пациента, то можете выбрать его из списка пациентов. Если пациент отсутствует в списке, Вы можете создать новую карту нажав на "Добавить нового пациента".\n\nДля загрузки снимка нажмите на "+" справа от форм ввода информации. Снимок может быть в формате .tiff или .png.\n\nПосле заполнения всех полей нажмите на "Провести диагностику". Если в левом углу появится зеленое предупреждение с надписью "Снимок загружен!", все поля были заполнены верно и можно открыть результаты диагностики, нажав на "Посмотреть результат".`
                },
                {
                    id: 'panel4',
                    question: 'Что делать, если некоторые снимки не открылись?',
                    answer: `Файлы большого размера действительно могут обрабатываться дольше, чем вы получите возможность посмотреть результат.\n\nВ этом нет ничего страшного. Надпись "Снимок анализируется" означает, что ассистент еще обрабатывает результат, и как только снимок обработается, он сразу же появится на месте пустых разделов.\n\nПока идет обработка, Вы можете изменить данные по диагностике: заполнить эхографические признаки или присвоить определенный Вами тип узла.\n\nНе забудьте сохранить введенные данные, нажав на "Сохранить результат".`
                },
                {
                    id: 'panel5',
                    question: 'Что делать, если я хочу сохранить снимок?',
                    answer: 'Для этого необходимо нажать на "Сохранить" над картинкой, которую Вы хотели бы сохранить на свой компьютер.'
                },
                {
                    id: 'panel6',
                    question: 'Что делать, если я не могу согласиться с результатами анализа?',
                    answer: `Для таких случаев предусмотрен механизм публикации материалов на ресурс.\n\nДля того, чтобы воспользоваться данной функцией, Вам необходимо нажать на "Добавить результат на ресурс". Нажатие перенаправит Вас на редактор масок для обучения.\n\nВ данном редакторе у Вас есть возможность выделения положения узла на исходном снимке и выбора определенного Вами типа узла по EU TI-RADS. Не забудьте сохранить, нажав на иконку дискеты.`
                },
                {
                    id: 'panel7',
                    question: 'Как посмотреть предыдущие диагностики?',
                    answer: `Для этого необходимо зайти в список пациентов, нажав на "Пациенты".\n\nВ данном разделе будут находится все пациенты, добавленные в систему. Для открытия всей информации о пациенте необходимо нажать "Открыть карту". Карты пациентов можно фильтровать или сортировать для более удобного поиска. Для этого необходимо нажать на три точки рядом с одним из заголовков таблицы.\n\nВ данном разделе так же можно добавить нового пациента, нажав на "+".\n\nВ разделе "Снимки", куда вы перейдете после открытия карты, будут находится все предыдущие диагностики пациента, добавленные в систему. Для открытия всей информации о диагностике необходимо нажать "Открыть результат". Диагностики можно фильтровать или сортировать для более удобного поиска. Для этого необходимо нажать на три точки рядом с одним из заголовков таблицы.\n\nВ данном разделе так же можно добавить новый снимок, нажав на "+". Или отредактировать информацию о пациенте, нажав на иконку карандаша.`
                }
            ].map((item) => (
                <Accordion
                    key={item.id}
                    sx={{
                        marginBlock: 2,
                        borderRadius: '12px !important',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        transition: 'all 0.3s ease',
                        '&:before': { display: 'none' },
                        '&:hover': {
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            borderColor: '#cbd5e0',
                        },
                        '&.Mui-expanded': {
                            marginBlock: 2,
                            boxShadow: '0 8px 25px rgba(34, 146, 203, 0.15)',
                            borderColor: '#2292cb',
                        }
                    }}
                    elevation={0}
                    expanded={expanded === item.id}
                    onChange={handleChange(item.id)}
                >
                    <AccordionSummary
                        expandIcon={
                            <ArrowForwardIosSharpIcon
                                sx={{
                                    fontSize: '1rem',
                                    color: expanded === item.id ? '#2292cb' : '#64748b',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        }
                        aria-controls={`${item.id}-content`}
                        id={`${item.id}-header`}
                        sx={{
                            flexDirection: 'row-reverse',
                            padding: '16px 24px',
                            minHeight: '64px !important',
                            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                                transform: 'rotate(90deg)',
                                color: '#2292cb',
                                marginRight: 2
                            },
                            '& .MuiAccordionSummary-content': {
                                marginLeft: 3,
                                marginRight: 2,
                            },
                            backgroundColor: expanded === item.id ? '#f0f9ff' : 'transparent',
                            borderRadius: expanded === item.id ? '12px 12px 0 0' : '12px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Typography
                            variant={'h6'}
                            fontWeight={'500'}
                            fontFamily={'"Inter", "Helvetica Neue", Arial, sans-serif'}
                            sx={{
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                color: expanded === item.id ? '#2292cb' : '#374151',
                                lineHeight: 1.4,
                                letterSpacing: '-0.01em'
                            }}
                        >
                            {item.question}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        sx={{
                            padding: '24px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '0 0 12px 12px',
                            borderTop: '1px solid #e2e8f0'
                        }}
                    >
                        <Typography
                            variant={'body1'}
                            fontWeight={'400'}
                            fontFamily={'"SF Pro Display", "Segoe UI", Roboto, sans-serif'}
                            sx={{
                                fontSize: { xs: '0.95rem', md: '1.05rem' },
                                color: '#4b5563',
                                lineHeight: 1.7,
                                whiteSpace: 'pre-line',
                                letterSpacing: '0.01em'
                            }}
                        >
                            {item.answer}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
        </Box>
    );
}