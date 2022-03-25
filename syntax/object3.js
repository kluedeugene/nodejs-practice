var o = {
	v1: 'v1',
	v2: 'v2',
	f1: function () {
		console.log(this.v1); //함수가 속해있는 객체의 개체를 참조할수있게하는 this
	},
	f2: function () {
		console.log(this.v2);
	}
};

o.f1();
o.f2();
