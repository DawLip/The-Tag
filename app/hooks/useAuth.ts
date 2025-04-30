import { RelativePathString, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';


export function useAuth(routeAuthed:boolean=false, path:string|null=null) {
  const router = useRouter();
  const token = useSelector((state:any) => state.auth.token);

  useEffect(()=>{
    const navigate = (path:any) => router.push(path);
    if(!token && !routeAuthed) navigate(path || '/(auth)/')
    if(token && routeAuthed) navigate(path || '/(main)/(home)/Home')
  }, [token])
}