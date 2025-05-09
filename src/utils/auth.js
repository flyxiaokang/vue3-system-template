import Cookies from "js-cookie";
// import { uuidOnlyStr } from "./uuid";

const TokenKey = "DY-BASEINFO-JINSHUI-Token";
const TourTokenKey = "DY-TOUR-TOKEN";
const SingleTokenKey = "DY-JINSHUI-SINGLE-Token";

export function getToken() {
	return Cookies.get(TokenKey);
}

// outtime 小时
export function setToken(token, outtime = 12) {
	return Cookies.set(TokenKey, token, {
		expires: new Date(new Date() * 1 + 60 * 60 * outtime * 1000),
	});
}

export function removeToken() {
	return Cookies.remove(TokenKey);
}

export function setTourToken() {
	// return Cookies.set(TourTokenKey, uuidOnlyStr());
}

export function getTourToken() {
	return Cookies.get(TourTokenKey);
}

export function removeTourToken() {
	return Cookies.remove(TourTokenKey);
}

export function setSingleToken() {
	return Cookies.set(SingleTokenKey, uuidOnlyStr());
}

export function getSingleToken() {
	return Cookies.get(SingleTokenKey);
}

export function removeSingleToken() {
	return Cookies.remove(SingleTokenKey);
}

export function clearStorage(){
	localStorage.removeItem("mp_sys_username")
	localStorage.removeItem("mp_sys_usercode")
	localStorage.removeItem("dy_sys_user_addvcd")
	localStorage.removeItem("dy_sys_user_unit_code")
	localStorage.removeItem("dy_sys_user_unit_name")
	localStorage.removeItem("dy_user_info")
	localStorage.removeItem("dy_user_unit")
	localStorage.removeItem("dy_user_role")
	localStorage.removeItem("dy_sys_nickname")
	removeSingleToken();
	sessionStorage.clear()
}

export function clearTokens(){
	removeToken()
	removeSingleToken()
	removeTourToken()
}