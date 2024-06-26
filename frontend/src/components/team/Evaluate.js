import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../../styles/bootstrap.min.css'; 
import './../../styles/Team.css'; //css

const BASE_URL = process.env.REACT_APP_BASE_URL;

function Evaluate() {
    //parametros recibidos
    const [error, setError] = useState(null);
    const { id, user_id, member_email } = useParams(); // Cambio aquí

    //parametros enviados
    const [values, setValues] = useState({
        qualification: '',
        comment: ''
    });
    const [errors, setErrors] = useState({});

    //Validación de Sesión
    const navigate = useNavigate();
    
    // eslint-disable-next-line no-unused-vars
    const [user, setUser] = useState(null);

    // Revisar si hay sesión al cargar el componente
    useEffect(() => {
        axios.get(`${BASE_URL}/checkSession`, { withCredentials: true })
          .then(response => {
            setUser(response.data);
          })
          .catch(error => {
            console.error("¡Hubo un error al obtener los datos del usuario!", error);
            navigate('/'); // Redirige a la página de inicio si no hay sesión
          });
    }, [navigate]);

    useEffect(() => {
        console.log("Received props: ", { id, user_id, member_email });
        // Verifica si todos los datos están disponibles
        if (id && user_id && member_email) {
            // Hacer la solicitud POST al servidor
            fetch(`${BASE_URL}/to-evaluate-member`, { // Reemplaza el puerto por el correcto
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, user_id, member_email })//datos que se reciben
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Podrías realizar acciones adicionales aquí si es necesario
            })
            .catch(error => {
                // Manejo de cualquier error
                setError(error.message);
            });
        }
    }, [id, user_id, member_email]); // Ejecutar efecto cuando cualquiera de estos datos cambie

    if (error) {
        return (
            <div className="evaluate-container">
                <p style={{ color: '#000' }}>{error}</p>
            </div>
        );
    }

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!values.qualification) {
            setErrors({ qualification: "Qualification is required" });
            return;
        }

        if (!values.comment) {
            setErrors({ comment: "Comment is required" });
            return;
        }
    
        try {
            const postData = {
                evaluated_email: member_email,
                qualification: values.qualification,
                comment: values.comment
            };
    
            const response = await axios.post(`${BASE_URL}/evaluate-member`, postData);
    
            if (response.data === "Success") {
                alert('Usuario Evaluado Exitosamente');
                // Redirige al usuario a la lista de miembros
                navigate(`/teams/${id}/list-members`);
            } else {
                alert("Ha Ocurrido un Error en la Evaluación")
            }
        } catch (error) {
            console.error('Error evaluating member:', error);
            // Handle error if needed
        }
    };

    return (
        <section className="container mt-5 mb-5 text-white">
            <div className="text-center mb-4">
                <h3>Evaluacion</h3>
                <h5>{member_email}</h5>
                <h5>{user.name}</h5>                
                {/* <p>ID: {id}</p> */}
                {/* <p>User ID: {user_id}</p> */}
            </div>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='qualification'><strong>Calificacion:</strong></label>
                    <select id="qualification" name='qualification'
                        onChange={handleInput} className={'form-control rounded-0' + (errors.qualification ? ' is-invalid' : '')}>
                            <option value='1'>1 Estrella:  &#9733;</option>
                            <option value='2'>2 Estrellas: &#9733;&#9733;</option>
                            <option value='3'>3 Estrellas: &#9733;&#9733;&#9733;</option>
                            <option value='4'>4 Estrellas: &#9733;&#9733;&#9733;&#9733;</option>
                            <option value='5'>5 Estrellas: &#9733;&#9733;&#9733;&#9733;&#9733;</option>
                    </select>
                    {errors.qualification && <div className='invalid-feedback'> {errors.qualification}</div>}
                </div>
                
                <div className='form-group'>
                    <label htmlFor='comment'><strong>Comentarios:</strong></label>
                    <input type="text" placeholder='Ingresa tu comentario' name='comment'
                        onChange={handleInput} className={'form-control rounded-0' + (errors.comment ? ' is-invalid' : '')} />
                    {errors.comment && <div className='invalid-feedback'> {errors.comment}</div>}
                </div>
                <br/>
                <div className='form-group text-center'>
                    <button type='submit' className='btn btn-primary'>Evaluar</button>
                </div>
                <hr />
                <div className='text-center'>
                    <Link to={`/teams/${id}/list-members`} className='btn btn-secondary'>Atrás</Link>
                </div>
            </form>
            <div className='text'>Talent Switch</div>
        </section>
    );
}

export default Evaluate;