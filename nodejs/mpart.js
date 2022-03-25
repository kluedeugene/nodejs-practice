var M = {
	v: 'v',
	f: function () {
		console.log(this.v);
	}
};

// M이 가르키는 객체를 모듈 외부에서 사용할수있게 export
module.exports = M;
