import React from 'react'
import { useEffect } from 'react'
import imagen from './github.png'
import './githublogin.css'


export default function Githublogin() {


    const gitHubLogin = async () => {
        fetch(`http://localhost:8080/api/sessions/github`)
        
    }

    return (
        <div className='d-flex justify-content-center align-items-center'>
            <button className='btn btn-dark' onClick={gitHubLogin}><img src={imagen} alt='github_icon'></img> GitHub</button>   
        </div>
    )
}
