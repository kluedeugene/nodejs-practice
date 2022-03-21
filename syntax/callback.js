/*
function a(){
  console.log('A');
}
*/
//변수에 값으로써 함수를 가질수있다.자바스크립트에서는  함수는 값이다.
var a = function () {
	console.log('A');
};

function slowfunc(callback) {
	callback();
}

slowfunc(a);
//오래걸리는 함수를  slowfunc라고 가정.
//slowfunc를 완료한뒤 a함수의 console.log 를 실행한다.
