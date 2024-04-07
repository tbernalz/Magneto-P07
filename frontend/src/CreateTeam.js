import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './validations/CreateTeamValidation';
import axios from 'axios';
import './css/profile.css'; // css

function CreateOpportunity() {
    const [values, setValues] = useState({
        team_name: '',
        leader_user_id: '',
        team_area: '',
        description: '',
        start_date: '',
        final_date: ''
    })

    const navigate = useNavigate();
    const [errors, setErrors] = useState({})    
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));
        if (
            !errors.team_name &&
            !errors.leader_user_id &&
            !errors.team_area &&
            !errors.description &&
            !errors.start_date &&
            !errors.final_date
        ) {
            axios.post('http://localhost:8081/create-team', values)
                .then(res => {
                    navigate('/home');
                })
                .catch(err => console.log(err));
        }
    }


  return (
    <section>
        <form  action='' onSubmit={handleSubmit}>
            <h2>Create Project Team</h2>

            <div className='inputbox'>
                <label htmlFor='team_name'><strong>Opportunity Name</strong></label>
                <input type="text" placeholder='Enter Team Name' name='team_name'
                onChange={handleInput} className='form-control rounded-0' />
                {errors.team_name && <span className='text-danger'> {errors.team_name}</span>}
            </div>

            <div className='inputbox'>
                {/* Pensar cambiar por no mostrar */}
                <label htmlFor='leader_user_id'><strong>Leader User ID</strong></label>
                <input type="text" placeholder='Enter Leader User ID' name='leader_user_id'
                onChange={handleInput} className='form-control rounded-0' />
                {errors.leader_user_id && <span className='text-danger'> {errors.leader_user_id}</span>}
            </div>

            <div className='inputbox'>
                <label htmlFor='team_area'><strong>Team Area</strong></label>
                <input type="text" placeholder='Enter Team Area' name='team_area'
                onChange={handleInput} className='form-control rounded-0' />
                {errors.team_area && <span className='text-danger'> {errors.team_area}</span>}
            </div>

            <div className='inputbox'>
                <label htmlFor='description'><strong>Description</strong></label>
                <input type="text" placeholder='Enter Description' name='description'
                onChange={handleInput} className='form-control rounded-0' />
                {errors.description && <span className='text-danger'> {errors.description}</span>}
            </div>

            <div className='inputbox'>
                <label htmlFor='start_date'><strong>Start Date</strong></label>
                <input type="date" name="start_date" onChange={handleInput} className='form-control rounded-0' />
                {errors.start_date && <span className='text-danger'> {errors.start_date}</span>}
            </div>

            <div className='inputbox'>
                <label htmlFor='final_date'><strong>Final Date</strong></label>
                <input type="date" name="final_date" onChange={handleInput} className='form-control rounded-0' />
                {errors.final_date && <span className='text-danger'> {errors.final_date}</span>}
            </div>

            <div>
                <button type='submit' className='button'>Create</button>    
            </div>
            <div>
                <hr/>
                <div>
                    <Link to="/home" className='link'>Back</Link>        
                </div>
            </div>
        </form>
        <div className='text'>Magneto07</div>
    </section>
  );
}

export default CreateOpportunity;