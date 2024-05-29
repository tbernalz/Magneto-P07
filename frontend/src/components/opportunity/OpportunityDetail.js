import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../../styles/Detail.css'; // Importa tus estilos CSS personalizados
import './../../styles/bootstrap.min.css'; 

function OpportunityDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [opportunity, setOpportunity] = useState(null);
    const [error, setError] = useState(null);
    const [values, setValues] = useState({
        opportunity_id: '',
        applicant_email: '',
    });
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState({ userName: '', email: '', userType: '' });

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }

    useEffect(() => {
        axios.get(`http://localhost:8081/checkSession`, { withCredentials: true })
          .then(response => {
            setUser(response.data);
          })
          .catch(error => {
            console.error("¡Hubo un error al obtener los datos del usuario!", error);
            navigate('/'); // Redirige a la página de inicio si no hay sesión
          });
    }, [navigate]);

    useEffect(() => {
        axios.get(`http://localhost:8081/opportunities/${id}`)
            .then(res => {
                setOpportunity(res.data);
                setValues(prev => ({...prev, opportunity_id: id}));
            })
            .catch(err => {
                console.log(err);
                setError("Opportunity not Found");
            });
    }, [id]);

    if (error) {
        return (
            <section className="opportunity-detail error">
                <p style={{ color: '#000' }}>{error}</p>
            </section>
        );
    }

    if (!opportunity) {
        return (
            <section className="opportunity-detail">
                <p>Loading...</p>
            </section>
        );
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!values.applicant_email) {
            setErrors({ applicant_email: "Email is required" });
            return;
        }

        const postData = {
            opportunity_id: values.opportunity_id,
            applicant_email: values.applicant_email
        };

        axios.post('http://localhost:8081/add-applicant', postData)
        .then(response => {
            if(response.data === "Success"){
                alert('User applied successfully')
            } else if(response.data === "applicant_exists"){
                alert("User has Already Applied for this Opportunity");
            } else if(response.data === "applicant_not_employee"){
                alert("Applicant is not an Employee");
            } else if(response.data === "user_not_exists"){
                alert("User not found or does not exist");
            } else{
                alert("An Error has Occurred")
            }
        })
        .catch(error => console.log(error));
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <section className="opportunity-detail">
            <div className="opportunity-header">
                <h2>{opportunity.opportunity_name}</h2>
            </div>
            <div className="opportunity-details">
                <p><strong>Opportunity Leader Email:</strong> {opportunity.opportunity_leader_email}</p>
                <p><strong>Opportunity Area:</strong> {opportunity.opportunity_area}</p>
                <p><strong>Description:</strong> {opportunity.description}</p>
                <p><strong>Required Skills:</strong> {opportunity.required_skills}</p>
                <p><strong>Start Date:</strong> {formatDate(opportunity.start_date)}</p>
                <p><strong>Final Date:</strong> {formatDate(opportunity.final_date)}</p>
                <p><strong>Opportunity State:</strong> {opportunity.opportunity_state} </p>
            </div>
            <hr />
            <div className="d-flex flex-column align-items-center">
                <form action='' onSubmit={handleSubmit}>
                    <input type="hidden" name="opportunity_id" value={id} />
                    <div className='emailDetail'>
                        <label htmlFor='applicant_email'><strong>Correo del aplicante</strong></label>
                        <input type="email" placeholder='Ingresa el correo del aplicante' name='applicant_email'
                        onChange={handleInput} className={'form-control rounded-0' + (errors.applicant_email ? ' is-invalid' : '')} />
                        {errors.applicant_email && <span className='text-danger'> {errors.applicant_email}</span>}
                    </div>
                    <div className="mt-2 text-center">
                        <button type='submit' className='btn btn-primary'>Aplicar</button>
                    </div>
                </form>
                <hr />
                <div className="mt-2">
                    <Link to={`/opportunities/${id}/list-applicants`} className='btn btn-primary'>Ver aplicantes</Link>
                </div>
            </div>
            <hr/>
            <Link to="/list-opportunities" className="btn btn-secondary mt-2">Atrás</Link>
            <div>
                <p className="dark_bg">This page generalizes the functions of both types of users, later they will be separated.</p>
            </div>
            <div className='text-center mt-4'>
                <p>Talent Switch</p>
            </div>
        </section>
    );
}

export default OpportunityDetail;
