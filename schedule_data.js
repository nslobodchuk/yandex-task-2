/*
Return school schedule between two dates
return room schedule between two dates
Add data type checks
Check that there are no illegal fields;
csv, tsv, json methods
*/

var ScheduleData = function(){
	this.lectures = {};
	this.schools = {};
	this.rooms = {};

	this.lecture_index = 0;
	this.school_index = 0;
	this.room_index = 0;

	this.lecture_index_mapping = {};
	this.school_index_mapping = {};
	this.room_index_mapping = {};
};

ScheduleData.prototype.school_template = {
	"name": new String,
	"n_students": new Number,
	"info": new String
};

ScheduleData.prototype.room_template = {
	"name": new String,
	"n_students": new Number,
	"info": new String
};

ScheduleData.prototype.lecture_template = {
	"topic": new String,
	"school": new Array(new String),
	"lecturer": new String,
	"room": new String,
	"start": new Date,
	"end": new Date
};

ScheduleData.prototype.set_school = function(d){

	for(var field in d){
		if(!(field in this.school_template)){
			throw "Error: field \"" + field + "\" is not allowed in school data."
		}
		if(d[field].constructor !== this.school_template[field].constructor){
			throw "Error: field \"" + field + "\" has type \"" + d[field].constructor.name + "\". Must be \"" + this.school_template[field].constructor.name + "\" instead.";
		}
	}


	if(!("name" in d)){
		throw "Данные о школе должны содержать поле \"name\"";
	}

	if(d["name"] in this.school_index_mapping){
		throw "Данная школа уже существует.";
	}

	if(!("n_students" in d)){
		throw "Данные о школе должны содержать поле \"n_students\"";
	}


	this.schools[this.school_index] = d;
	this.school_index_mapping[d["name"]] = this.school_index;
	this.school_index++;
};

ScheduleData.prototype.set_room = function(d){

	for(var field in d){
		if(!(field in this.room_template)){
			throw "Error: field \"" + field + "\" is not allowed in school data."
		}
		if(d[field].constructor !== this.room_template[field].constructor){
			throw "Error: field \"" + field + "\" has type \"" + d[field].constructor.name + "\". Must be \"" + this.room_template[field].constructor.name + "\" instead.";
		}
	}

	if(!("name" in d)){
		throw "Данные об аудитории должны содержать поле \"name\"";
	}

	if(d["name"] in this.room_index_mapping){
		throw "Данная аудитория уже существует.";
	}

	if(!("n_students" in d)){
		throw "Данные об аудитории должны содержать поле \"n_students\"";
	}

	this.rooms[this.room_index] = d;
	this.room_index_mapping[d["name"]] = this.room_index;
	this.room_index++;
};

ScheduleData.prototype.set_lecture = function(d){
	var array_type = new Array();

	for(var field in d){
		if(!(field in this.lecture_template)){
			throw "Error: field \"" + field + "\" is not allowed in school data."
		}
		if(d[field].constructor !== this.lecture_template[field].constructor){
			throw "Error: field \"" + field + "\" has type \"" + d[field].constructor.name + "\". Must be \"" + this.lecture_template[field].constructor.name + "\" instead.";
			
		} else if (this.lecture_template[field].constructor === array_type.constructor){
			    d[field].forEach(function(d){
				    if (d.constructor!==this.lecture_template[field][0].constructor){
				    	throw "Error: field \"" + field + "\" must be the array of \"" + this.lecture_template[field][0].constructor.name + "\" elements.";
				    }
			    }, this);
		}
		
	}

	if(!("topic" in d)){
		throw "Данные о лекции должны содержать поле \"topic\"";
	}

	if(d["topic"] in this.lecture_index_mapping){
		throw "Данная лекция уже существует.";
	}

	if(!("school" in d)){
		throw "Данные о лекции должны содержать поле \"school\"";
	}

	d["school"].forEach(function(d){
			if(!(d in this.school_index_mapping)) {
		    throw "В базе не найдена школа \""  + d +"\". Введите сначала данные об этой школе.";
		}
	}, this);
	

	if(!("lecturer" in d)){
		throw "Данные о лекции должны содержать поле \"lecturer\"";
	}

	if(!("room" in d)){
		throw "Данные о лекции должны содержать поле \"room\"";
	}

	if(!(d["room"] in this.room_index_mapping)){
	    throw "В базе не найдена аудитория \""  + d["room"]+"\". Введите сначала данные об этой аудитории.";
	}

	if(!("start" in d)){
		throw "Данные о лекции должны содержать поле \"start\"";
	}

	if(!("end" in d)){
		throw "Данные о лекции должны содержать поле \"end\"";
	}
	this.lectures[this.lecture_index] = d;
	this.lectures[this.lecture_index]["school"] = d["school"].map(function(d){return this.school_index_mapping[d];}, this);
	this.lectures[this.lecture_index]["room"] = this.room_index_mapping[d["room"]];
	this.lecture_index_mapping[d["topic"]] = this.lecture_index;

	var check = this.run_checks();
	if(check[0]==="Error"){
		delete this.lectures[this.lecture_index];
		delete this.lecture_index_mapping[d["topic"]];
		throw check[1];
	}

	this.lecture_index++;
};

ScheduleData.prototype.update_school = function(school, d){
	var si = this.school_index_mapping[school];

	if(!(school in this.school_index_mapping)) {
		throw "Error: school not found";
	}

	var d_ = {};
	Object.keys(this.schools[si]).forEach(function(field){
		d_[field] = this.schools[si][field];
	});

	for (p in d){
		this.schools[si][p] = d[p];
	}

	if(("name" in d)&&d["name"]!== school&&(d["name"] in this.school_index_mapping)){
		throw "Error: school with this name already exists.";
	}

	if(("name" in d)&&d["name"]!== school){
		delete this.school_index_mapping[school];
		this.school_index_mapping[d["name"]] = si;
	}

	var check = this.run_checks();
	if (check[0]==="Error"){
		this.schools[si] = d_;
		if(("name" in d)&&d["name"]!== school){
			this.school_index_mapping[school] = si;
			delete school_index_mapping[d["name"]];
		}
	}
};

ScheduleData.prototype.update_room = function(room, d){
	var ri = this.room_index_mapping[room];

	if(!(room in this.lecture_index_mapping)){
		throw "Error: room not found";
	}

	var d_ = {};
	Object.keys(this.rooms[ri]).forEach(function(field){
		d_[field] = this.rooms[ri][field];
	});

	for (p in d){
		this.rooms[ri][p] = d[p];
	}

	if(("name" in d)&&d["name"]!== room&&(d["name"] in this.room_index_mapping)){
		throw "Error: room with this name already exists.";
	}

	if(("name" in d)&&d["name"]!== room){
		delete this.room_index_mapping[room];
		this.room_index_mapping[d["name"]] = ri;
	}

	var check = this.run_checks();
	if (check[0]==="Error"){
		this.rooms[ri] = d_;
		if(("name" in d)&&d["name"]!== room){
			this.room_index_mapping[room] = ri;
			delete room_index_mapping[d["name"]];
		}
	}
};

ScheduleData.prototype.update_lecture = function(lecture, d){

	var li = this.lecture_index_mapping[lecture];

	if(!(lecture in this.lecture_index_mapping)){
		throw "Error: lecture not found";
	}

	var d_ = {};
	Object.keys(this.lectures[li]).forEach(function(field){
		d_[field] = this.lectures[li][field];
	});

	for (p in d){
		this.lectures[li][p] = d[p];
	}

	if("school" in d){
		this.lectures[li]["school"] = d["school"].map(function(d){return this.school_index_mapping[d];}, this);
	}

	if(("topic" in d)&&d["topic"]!== lecture&&(d["topic"] in this.lecture_index_mapping)){
		throw "Error: lecture with this topic already exists.";
	}

	if(("topic" in d)&&d["topic"]!== lecture){
		delete this.lecture_index_mapping[lecture];
		this.lecture_index_mapping[d["topic"]] = li;
	}

	var check = this.run_checks();
	if (check[0]==="Error"){
		this.lectures[li] = d_;
		if(("topic" in d)&&d["topic"]!== lecture){
			delete this.lecture_index_mapping[d["topic"]];
			this.lecture_index_mapping[lecture] = li;
		}
	}
};

ScheduleData.prototype.check_school_schedule = function(){
	var schedule;
	for(var si in this.schools){
		schedule = [];
		for (li in this.lectures){
			if(si in this.lectures[li]["school"]){
				schedule.push([this.lectures[li]["start"], this.lectures[li]["end"], li]);
			}
		}

		schedule.sort(function(a,b){
			return a[0]-b[0];
		});

		for (var i=0; i < schedule.length - 1; ++i){
			if (schedule[i][1]>schedule[i+1][0]){
				return ["Error", "Error: time conflict for school "+ this.schools[si]["name"]+ 
				" for lectures " + 
				this.lectures[schedule[i][2]]["topic"] + " and " + 
				this.lectures[schedule[i][2]]["topic"]];
			}
		}
	}

	return ["Ok", null];

};

ScheduleData.prototype.check_room_schedule = function(){
	var schedule;
	for(ri in this.rooms){
		schedule = [];
		for (li in this.lectures){
			if(ri === this.lectures[li]["room"]){
				schedule.push([this.lectures[li]["start"], this.lectures[li]["end"], li]);
			}
		}

		schedule.sort(function(a,b){
			return a[0]-b[0];
		});

		for (var i=0; i < schedule.length - 1; ++i){
			if (schedule[i][1]>schedule[i+1][0]){
				return ["Error", "Error: time conflict for room "+ this.rooms[ri]+ 
				" for lectures " + 
				this.lectures[schedule[i][2]]["name"] + " and " + 
				this.lectures[schedule[i][2]]["name"]] ;
			}
		}
	}

	return ["Ok", null];

};

ScheduleData.prototype.check_room_capacity = function(){
	var capacity = [], n_students, room;
	for (li in this.lectures){
		n_students = 0;
		this.lectures[li]["school"].forEach(function(d){
			n_students+=this.schools[d]["n_students"];
		}, this);
		ri= this.lectures[li]["room"];
		capacity.push([this.rooms[ri]["n_students"], n_students, li]);
	}
	console.log(capacity);

	for(var i = 0; i < capacity.length; ++i){
		if(capacity[i][0]<capacity[i][1]){
			return ["Error", "Error: room " + this.rooms[this.lectures[capacity[i][2]]["room"]]["name"] + " is over capacity for lecture " + this.lectures[capacity[i][2]]["topic"]];
		}
	}

	return ["Ok", null];

};

ScheduleData.prototype.run_checks = function(){
	var check = [this.check_school_schedule(), 
	this.check_room_schedule(), 
	this.check_room_capacity()];

	for(var i = 0; i<check.length; ++i){
		if (check[i][0]==="Error"){
			return check[i];
		}
	}
	return ["Ok", null];
};

ScheduleData.prototype.get_school_schedule = function(school, interval_start, interval_end){

	if(!(school in this.school_index_mapping)){
		throw "School \"" + school + "\" not found";
	}

	var si = this.school_index_mapping[school];
	var results = [];
	var result;
	for (var li in this.lectures){
		if((si in this.lectures[li]["school"])&&(this.lectures[li]["end"]>=interval_start||this.lectures[li]["start"]<= interval_end)){
			result = {};
			result["topic"] = this.lectures[li]["topic"];
			result["school"] = this.lectures[li]["school"].map(function(d){return this.schools[d]["name"];}, this);
			result["lecturer"] = this.lectures[li]["lecturer"];
			result["room"] = this.rooms[this.lectures[li]["room"]]["name"];
			result["start"] = this.lectures[li]["start"];
			result["end"] = this.lectures[li]["end"];
			results.push(result);
		}
	}
	return results;
}

ScheduleData.prototype.get_room_schedule = function(room, interval_start, interval_end){

	if(!(room in this.room_index_mapping)){
		throw "Room \"" + room + "\" is not found";
	}

	var ri = this.room_index_mapping[room];
	var results = [];
	var result;
	for (var li in this.lectures){
		if((ri === this.lectures[li]["room"])&&(this.lectures[li]["end"]>=interval_start||this.lectures[li]["start"]<= interval_end)){
			result = {};
			result["topic"] = this.lectures[li]["topic"];
			result["school"] = this.lectures[li]["school"].map(function(d){return this.schools[d]["name"];}, this);
			result["lecturer"] = this.lectures[li]["lecturer"];
			result["room"] = this.rooms[this.lectures[li]["room"]]["name"];
			result["start"] = this.lectures[li]["start"];
			result["end"] = this.lectures[li]["end"];
			results.push(result);
		}
	}
	return results;
};

ScheduleData.prototype.get_school = function(school){
	if(!(school in this.school_index_mapping)){
		throw "School \"" + school + "\" is not found";
	}

	var si = this.school_index_mapping[school];

	var result = {};

	for (var field in this.schools[si]){
		result[field] = this.schools[si][field];
	};

	return result;
};

ScheduleData.prototype.get_room = function(room){
	if(!(room in this.room_index_mapping)){
		throw "Room \"" + room + "\" is not found";
	}

	var ri = this.room_index_mapping[room];

	var result = {};

	for (var field in this.rooms[ri]){
		result[field] = this.rooms[ri][field];
	};

	return result;
};

ScheduleData.prototype.get_lecture = function(lecture){
	if(!(lecture in this.lecture_index_mapping)){
		throw "Lecture " + lecture + " not found";
	}

	var li = this.lecture_index_mapping[lecture];
	var result = {};
	result["topic"] = this.lectures[li]["topic"];
	result["school"] = this.lectures[li]["school"].map(function(d){return this.schools[d]["name"];}, this);
	result["lecturer"] = this.lectures[li]["lecturer"];
	result["room"] = this.rooms[this.lectures[li]["room"]]["name"];
	result["start"] = this.lectures[li]["start"];
	result["end"] = this.lectures[li]["end"];

	return result;
};

ScheduleData.prototype.delete_school = function(school){

	if(!(school in this.school_index_mapping)){
		throw "School \"" + school + "\" is not found";
	}

	var si = this.school_index_mapping[school];

	for (var li in this.lectures){
		if(si in this.lectures[li]["school"]){
			throw "Can't delete because lecture \"" + this.lectures[li]["topic"] + "\" is scheduled for this school. Delete lecture \"" + this.lectures[li]["topic"] + "\" first.";
		}
	}

	delete this.school_index_mapping[school];
	delete this.rooms[si];
};

ScheduleData.prototype.delete_room = function(room){

	if(!(room in this.room_index_mapping)){
		throw "Room \"" + room + "\" is not found";
	}

	var ri = this.room_index_mapping[room];

	for (var li in this.lectures){
		if(ri === this.lectures[li]["room"]){
			throw "Can't delete because lecture \"" + this.lectures[li]["topic"] + "\" is scheduled in this room. Delete lecture \"" + this.lectures[li]["topic"] + "\" first.";
		}
	}

	delete this.room_index_mapping[room];
	delete this.rooms[ri];
};

ScheduleData.prototype.delete_lecture = function(lecture){

	if(!(lecture in this.lecture_index_mapping)){
		throw "Lecture \"" + lecture + "\" is not found";
	}

	delete this.rooms[this.lecture_index_mapping[lecture]];
	delete this.lecture_index_mapping[lecture];

};





