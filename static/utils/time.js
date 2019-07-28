const formatDate = date =>{
	let year = date.getFullYear();
	let month = date.getMonth()+1;
	let day = date.getDate();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();
	return [year,month,day].map(formatNumber).join('-')+" "+[hours,minutes,seconds].map(formatNumber).join(':');
}

const format = date =>{
	let year = date.getFullYear();
	let month = date.getMonth()+1;
	let day = date.getDate();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();
	return [year,month,day].map(formatNumber).join('-')
}

const formatNumber = n =>{
	n = n.toString();
	return n[1]?n:'0'+n;  //表示字符串第一个数是否存在
}

module.exports = {
	formatDate:formatDate,
	format:format
}