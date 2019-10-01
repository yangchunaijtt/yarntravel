import Cookie from "./cookie.js";
const userid=Cookie.get("USERIDGDLY");
const WHERE=Cookie.get("WHERE");
const gdmobileusername=Cookie.get("gdmobileusername");
const gdmobileuserphone=Cookie.get("gdmobileuserphone");
const usersecret=Cookie.get("usersecret");



export const isLogin= ()=>{
  if(userid==null||userid==""){
    console.log("userid")
    return false;
  }
  if(gdmobileusername==null||gdmobileusername==""){
    console.log("gdmobileusername")

    return false;
  }
  if(gdmobileuserphone==null||gdmobileuserphone==""){
    return false;
  }
  if(usersecret==null||usersecret==""){
    return false;
  }
  return true;  
}
export const getToken=()=>{
  return `?token=${Cookie.get("USERIDGDLY")}|${Cookie.get(
    "usersecret"
  )}|${Cookie.get("gdmobileuserphone")}|${Cookie.get("WHERE")}`
}


