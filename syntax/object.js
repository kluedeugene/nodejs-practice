var members = ['egoing', 'kimeugene', 'yaho']; //배열
console.log(members[1]);
var i = 0;
while (i < members.length) {
	console.log('array loop:', members[i]);
	i = i + 1;
}

var roles = {
	programmer: 'egoing',
	designer: 'kimeugene',
	manager: 'yaho'
};

console.log(roles.programmer); //egoing
console.log(roles['programmer']); //egoing

for (var name in roles) {
	console.log('object =>', name, 'value=>', roles[name]);
}
