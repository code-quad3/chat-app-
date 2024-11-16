import {useEffect} from 'react';
import {useNavigate,useLocation} from 'react-router-dom';
function SocialLoginRedirect(){
    const navigate = useNavigate();
    const location = useLocation();
 useEffect(()=>{
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

        window.localStorage.setItem('token',token);
        navigate('/home',{replace: true});
    
 },[location,navigate]);
 return null;
}

export default SocialLoginRedirect;