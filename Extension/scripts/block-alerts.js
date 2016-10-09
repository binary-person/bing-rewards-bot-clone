window.confirm = function(msg)
{
	console.log('Alert blocked : ' + msg);
	return false;
}

window.alert = function(msg)
{
	console.log('Alert blocked : ' + msg);
	return false;
}
