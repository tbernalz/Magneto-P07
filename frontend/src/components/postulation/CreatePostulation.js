import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from '../../utils/validations/CreatePostulationValidation';
import axios from 'axios';
import './../../styles/profile.css'; // css

function CreatePostulation() {
    const [values, setValues] = useState({
        postulant_name: '',
        postulant_email: '',
        postulant_actual_area: '',
        postulant_interest_area: '',
        postulant_skills: '',
    })

    const navigate = useNavigate();
    const [errors, setErrors] = useState({})    
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));
    
        // Realiza una consulta a la base de datos para obtener el nombre asociado al correo electrónico
        axios.get(`http://localhost:8081/get-name?email=${values.postulant_email}`)
            .then(res => {
                const userName = res.data.name; // Suponiendo que el nombre se devuelve como 'name'
                // Actualiza el estado con el nombre encontrado en la db
                setValues(prev => ({...prev, postulant_name: userName }));
    
                // Crea un nuevo objeto con los datos actualizados, incluido el nombre
                const postData = {
                    postulant_name: userName,
                    postulant_email: values.postulant_email,
                    postulant_actual_area: values.postulant_actual_area,
                    postulant_interest_area: values.postulant_interest_area,
                    postulant_skills: values.postulant_skills
                };
    
                // Envía los datos actualizados al servidor para la creación de la postulación
                axios.post('http://localhost:8081/create-postulation', postData)
                    .then(res => {
                        if(res.data === "Success"){
                            //por ahora alert
                            alert('Postulation was created');
                            navigate('/home');
                        } else {
                            alert("It was not possible to create the Postulation");
                            navigate('/home');
                        }
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }


  return (
    <section>
        <form  action='' onSubmit={handleSubmit}>
            <h2>Create Postulation</h2>

            {/* <div className='inputbox'>
                <label htmlFor='postulant_name'><strong>Postulant Name</strong></label>
                <input type="text" placeholder='Enter Postulant Name' name='postulant_name'
                onChange={handleInput} className={'form-control rounded-0' + (errors.postulant_name ? ' is-invalid' : '')} />
                {errors.postulant_name && <span className='text-danger'> {errors.postulant_name}</span>}
            </div> */}

            <div className='inputbox'>
                {/* Pensar cambiar por no mostrar */}
                <label htmlFor='postulant_email'><strong>Postulant Email</strong></label>
                <input type="text" placeholder='Enter Postulant Email' name='postulant_email'
                onChange={handleInput} className={'form-control rounded-0' + (errors.postulant_email ? ' is-invalid' : '')} />
                {errors.postulant_email && <span className='text-danger'> {errors.postulant_email}</span>}
            </div>

            <div className='inputbox'>
                <label htmlFor='postulant_actual_area'><strong>Postulant Actual Area</strong></label>
                <input type="text" placeholder='Enter Postulant Actual Area' name='postulant_actual_area'
                onChange={handleInput} className={'form-control rounded-0' + (errors.postulant_actual_area ? ' is-invalid' : '')}/>
                {errors.postulant_actual_area && <span className='text-danger'> {errors.postulant_actual_area}</span>}
            </div>

            <div className='inputbox'>
                <label htmlFor='postulant_interest_area'><strong>Postulant Interest Area</strong></label>
                <input type="text" placeholder='Enter Postulant Interest Area' name='postulant_interest_area'
                onChange={handleInput} className={'form-control rounded-0' + (errors.postulant_interest_area ? ' is-invalid' : '')}/>
                {errors.postulant_interest_area && <span className='text-danger'> {errors.postulant_interest_area}</span>}
            </div>

            <div className='inputbox'>
                <label htmlFor='postulant_skills'><strong>Postulant Skills</strong></label>
                <input type="text" placeholder='Enter Postulant Skills' name='postulant_skills'
                onChange={handleInput} className={'form-control rounded-0' + (errors.postulant_skills ? ' is-invalid' : '')}/>
                {errors.postulant_skills && <span className='text-danger'> {errors.postulant_skills}</span>}
            </div>

            <div>
                <button type='submit' className='button'>Create</button>    
            </div>
            <div>
                <hr/>
                <div>
                    <Link to="/home" className='link-button'>Back</Link>        
                </div>
            </div>
        </form>
        <div className='text'>Magneto07</div>
    </section>
  );
}

export default CreatePostulation;