import * as React from 'react';
import '@fontsource/poppins/700.css'

import { Button, Chip, FormControl, IconButton, Paper, TextField} from "@mui/material";
import {Box} from "@mui/material";
import DataTable from 'react-data-table-component';

import ClearIcon from '@mui/icons-material/Clear';
import {Link} from "react-router-dom";
import GlobalStyles from "@mui/material/GlobalStyles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {useEffect, useState} from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import EditIcon from "@mui/icons-material/Edit";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';

function createData(id, patientName, patientPolicy, email, uziDate, hasNodules, isActive) {
    return {id: id, patientName: patientName,patientPolicy: patientPolicy, email: email,uziDate: uziDate.toLocaleDateString(),hasNodules: hasNodules,isActive: isActive};
}

const FilterComponent = (props) => (
    <Paper className={'sixth-step'} elevation={0} sx={{
        justifyContent: 'center',
        alignContent:'center',
        alignItems: 'center',
        justifyItems: 'center',
        display: 'flex',
        background: 'transparent'
    }}>
        <TextField
            id="search"
            type="text"
            placeholder="Поиск по имени или номеру полиса"
            aria-label="Search Input"
            value={props.filterText}
            onChange={(e) => props.onFilter(e.target.value)}
            sx={{
                width: 350,
                '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#4FB3EAFF',
                            borderWidth: 2
                        }
                    },
                    '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#4FB3EAFF'
                        }
                    }
                },
                '& .MuiOutlinedInput-input': {
                    padding: '12px 16px',
                    fontSize: '14px'
                }
            }}
        />
        <IconButton
            onClick={() => props.onFilter("")}
            sx={{
                color: '#666',
                '&:hover': {
                    color: '#4FB3EAFF',
                    backgroundColor: 'rgba(79, 179, 234, 0.1)'
                }
            }}
        >
            <ClearIcon />
        </IconButton>
    </Paper>
);

const paginationComponentOptions = {
    rowsPerPageText: 'Строк на странице',
    rangeSeparatorText: 'из',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Все',
};

const MyGrid = (props) => {
    var [tableData, setTableData] = useState([])
    var filteredItems = tableData.filter(item => ((item.patientName && item.patientName.toLowerCase().includes(props.filterText.toLowerCase())) || (item.patientPolicy && item.patientPolicy.toLowerCase().includes(props.filterText.toLowerCase()))), );

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f8f9fa',
                borderBottomWidth: '2px',
                borderBottomColor: '#e9ecef',
                fontSize: '14px',
                fontWeight: '600',
            },
        },
        headCells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#2c3e50',
            },
        },
        cells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
                fontSize: '14px',
            },
        },
        rows: {
            style: {
                backgroundColor: '#ffffff',
                '&:not(:last-of-type)': {
                    borderBottomColor: '#f1f3f4',
                },
                '&:hover': {
                    backgroundColor: '#f8fdff',
                },
            },
        },
        pagination: {
            style: {
                backgroundColor: 'transparent',
                borderTopColor: '#e9ecef',
            },
        },
    };

    const columns = [
        {
            name: 'Пациент',
            width: '230px',
            sortable: true,
            selector: row => row.patientName,
            style: {
                fontWeight: '500',
            }
        },
        {
            name: 'Полис пациента',
            width: '210px',
            sortable: true,
            selector: row => row.patientPolicy
        },
        {
            name: 'Эл. почта',
            width: '230px',
            sortable: true,
            selector: row => row.email
        },
        {
            name: 'Дата приема',
            width: '130px',
            sortable: true,
            selector: row => row.uziDate
        },
        {
            name: 'Диагноз',
            width: '160px',
            cell: (row) => renderChip2(row.hasNodules),
        },
        {
            name: 'Статус',
            width: '160px',
            sortable: false,
            cell: (row) => renderChip(row.isActive),
        },
        {
            name: '',
            width: '190px',
            sortable: false,
            cell: (row) => renderDetailsButton(row.id),
            disableColumnMenu: true,
        },
    ];

    const renderDetailsButton = (params) => {
        return (
            <Button
                className={'seventh-step'}
                component={Link}
                to={'/patient/' + params}
                variant="outlined"
                size={'small'}
                sx={{
                    marginLeft: 2,
                    width: '100%',
                    maxWidth: 150,
                    color: '#4FB3EAFF',
                    borderColor: '#4FB3EAFF',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: '500',
                    '&:hover': {
                        backgroundColor: 'rgba(79, 179, 234, 0.1)',
                        borderColor: '#4FB3EAFF',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(79, 179, 234, 0.2)'
                    },
                    transition: 'all 0.2s ease'
                }}
            >
                Карта пациента
            </Button>
        )
    }

    const renderChip = (params) => {
        return (
            <Chip
                className={'fourth-step'}
                size={'small'}
                label={params ? "Активен" : "Не активен"}
                variant={'outlined'}
                sx={{
                    marginLeft: 2,
                    borderColor: params ? '#00d995' : '#ff6b6b',
                    color: params ? '#00d995' : '#ff6b6b',
                    fontWeight: '500',
                    backgroundColor: params ? 'rgba(0, 217, 149, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                    '& .MuiChip-label': {
                        px: 1.5
                    }
                }}
            />
        )
    }

    const renderChip2 = (params) => {
        return (
            <Chip
                className={'fifth-step'}
                size={'small'}
                label={params ? "Обнаружено" : "Не обнаружено"}
                variant={'outlined'}
                sx={{
                    marginLeft: 2,
                    borderColor: params ? '#4FB3EAFF' : '#95a5a6',
                    color: params ? '#4FB3EAFF' : '#95a5a6',
                    fontWeight: '500',
                    backgroundColor: params ? 'rgba(79, 179, 234, 0.1)' : 'rgba(149, 165, 166, 0.1)',
                    '& .MuiChip-label': {
                        px: 1.5
                    }
                }}
            />
        )
    }

    useEffect(() => {
        var storedNames = JSON.parse(localStorage.getItem("names"));
        if (storedNames === null) {
            storedNames = []
        }
        storedNames.reverse()
        var tmpAr = [];
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(props.url + '/med_worker/patients/'+localStorage.getItem('id')).then((response) => {
            console.log(response.data.results)
            for (let cur of response.data.results.cards) {
                tmpAr.push(createData(cur.patient.id, cur.patient.last_name + " " + cur.patient.first_name + " " + cur.patient.fathers_name, cur.patient.personal_policy, cur.patient.email,  new Date(Date.parse(cur.acceptance_datetime)), cur.has_nodules === "T", cur.patient.is_active))
            }
        })
            .then(() => setTableData(tmpAr))

    }, [props.url])

    return (
        <Box sx={{width: '100%', borderRadius: 3, overflow: 'hidden'}}>
            <DataTable
                className={'third-step'}
                columns={columns}
                data={filteredItems}
                pagination
                persistTableHead
                paginationComponentOptions={paginationComponentOptions}
                customStyles={customStyles}
                highlightOnHover
                pointerOnHover
            />
        </Box>
    )
}

class PatientTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: "",
            lastName: "",
            firstName: "",
            fathersName:'',
            medOrg: "",
            is_remote_worker: true,
            job: "",
            mesAm: 0
        };
    }

    componentDidMount() {
        this.handleInformation()
    }

    handleInformation = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
        axios.get(this.props.url + '/med_worker/patients/'+localStorage.getItem('id'))
            .then((response) => {
                    this.setState({
                        lastName: response.data.results.med_worker.last_name,
                        firstName: response.data.results.med_worker.first_name,
                        fathersName:response.data.results.med_worker.fathers_name,
                        medOrg: response.data.results.med_worker.med_organization === null || response.data.results.med_worker.med_organization === ""? "Место работы не указано":response.data.results.med_worker.med_organization,
                        is_remote_worker: response.data.results.med_worker.is_remote_worker,
                        job: response.data.results.med_worker.job === null || response.data.results.med_worker.job === ""? "должность не указана": response.data.results.med_worker.job,
                    })
                    axios.get(this.props.url+'/inner_mail/notifications/all/'+ localStorage.getItem('id')+'/?status=0').then((response) => {
                        this.setState({
                            mesAm: response.data.count
                        })
                    })
                }
            )
    }

    handleFilterText = (e) => {
        this.setState({
            filterText: e
        })
    }

    render() {
        return (
            <FormControl sx={{height: '100%', width: '100%', background: '#f8fdff'}}>
                <Box sx={{
                    minHeight: '100vh',
                    padding: 10,
                }}>
                    {/* Header Section */}
                    <Card
                        className={'first-step'}
                        sx={{
                            mb: 4,
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fdff 100%)',
                            border: '1px solid rgba(79, 179, 234, 0.1)'
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={12} md={8}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: '700',
                                                color: '#2c3e50',
                                                mr: 2,
                                                background: 'linear-gradient(135deg, #4FB3EAFF, #1565C0)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text'
                                            }}
                                        >
                                            {this.state.lastName + " " + this.state.firstName + " " + this.state.fathersName}
                                        </Typography>
                                        <IconButton
                                            component={Link}
                                            to={`/profile/edit/`}
                                            sx={{
                                                color: '#4FB3EAFF',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(79, 179, 234, 0.1)',
                                                    transform: 'scale(1.1)'
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <EditIcon className={'second-step'}/>
                                        </IconButton>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                        <Chip
                                            label={this.state.medOrg}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'rgba(79, 179, 234, 0.1)',
                                                color: '#4FB3EAFF',
                                                fontWeight: '500'
                                            }}
                                        />
                                        <Chip
                                            label={this.state.job}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'rgba(0, 217, 149, 0.1)',
                                                color: '#00d995',
                                                fontWeight: '500'
                                            }}
                                        />
                                        {this.state.is_remote_worker && (
                                            <Chip
                                                label="Удаленная работа"
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'rgba(255, 167, 38, 0.1)',
                                                    color: '#FFA726',
                                                    fontWeight: '500'
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                                    <Badge
                                        badgeContent={this.state.mesAm}
                                        color="error"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                backgroundColor: '#ff6b6b',
                                                color: 'white',
                                                fontWeight: '600'
                                            }
                                        }}
                                    >
                                        <Button
                                            component={Link}
                                            to="/inbox"
                                            variant="outlined"
                                            sx={{
                                                color: '#4FB3EAFF',
                                                borderColor: '#4FB3EAFF',
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: '500',
                                                px: 3,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(79, 179, 234, 0.1)',
                                                    borderColor: '#4FB3EAFF'
                                                }
                                            }}
                                        >
                                            Сообщения
                                        </Button>
                                    </Badge>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Patients Section */}
                    <Card
                        sx={{
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(79, 179, 234, 0.1)'
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            {/* Header */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 4,
                                flexWrap: 'wrap',
                                gap: 2
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: '600',
                                            color: '#2c3e50',
                                            background: 'linear-gradient(135deg, #2c3e50, #4FB3EAFF)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        Мои пациенты
                                    </Typography>
                                    <IconButton
                                        component={Link}
                                        to={`/patient/create`}
                                        sx={{
                                            backgroundColor: '#4FB3EAFF',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#3a9bc8',
                                                transform: 'scale(1.1)'
                                            },
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 4px 12px rgba(79, 179, 234, 0.3)'
                                        }}
                                    >
                                        <AddCircleOutlineIcon className={'eighth-step'} />
                                    </IconButton>
                                </Box>
                                <FilterComponent
                                    filterText={this.state.filterText}
                                    onFilter={this.handleFilterText}
                                />
                            </Box>

                            {/* Table */}
                            <Box sx={{ minHeight: 470 }}>
                                <MyGrid url={this.props.url} filterText={this.state.filterText}/>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </FormControl>
        )
    }
}

export default PatientTable;