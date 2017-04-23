# ScheduleData API Reference

## Table of Contents

* [Initialization](#initialization)
* [Entering new data](#entering-new-data)   
* [Updating existing data](#updating-existing-data)
* [Retrieving data](#retrieving-data) 
* [Retrieving schedule](#retrieving-schedule) 

## Initialization 
`var schedule_data = new ScheduleData;` creates a new instance of ScheduleData with methods from `ScheduleData.prototype`.

## Entering new data 

### ScheduleData.prototype.*set_school*(school)  

Adds a new `school` (Object) to the database. `school` is an object describing the school. Allowed fields are:
 * `"name"`. School name. Mandatory field. Must be a String.
 * `"n_students"`. The number of enrolled students. Mandatory field. Must be a Number.
 * `"info"`. Information about the school. Optional field. Must be a String.

For example:  
```
var school = {
    "name": "A School Name", 
    "n_students": 125, 
    "info": "Some school description."
    };  
schedule_data.set_school(school);
```  

If the field is illegal (not `name`, `n_students`, or `info`) or the data type does not match the allowed data type, an error will be thrown. If a mandatory field is missing, an error will be thrown.

### ScheduleData.prototype.*set_room*(room)

Adds a new `room` (Object) to the database. `room` is an object describing the room. Allowed fields are:
 * `"name"`. Room name. Mandatory field. Must be a String.
 * `"n_students"`. Room capacity. Mandatory field. Must be a Number.
 * `"info"`. Information about the room. Optional field. Must be a String.

For example:  
```
var room = {
    "name": "A Room Name", 
    "n_students": 150, 
    "info": "Some room description."
    };  
schedule_data.set_room(room);
```  

If the field is illegal (not `name`, `n_students`, or `info`) or the data type does not match the allowed data type, an error will be thrown. If a mandatory field is missing, an error will be thrown.

### ScheduleData.prototype.*set_lecture*(lecture)

Adds a new `lecture` (Object) to the database. `lecture` is an object describing the lecture. Allowed fields are:
 * `"topic"`. Lecture topic. Mandatory field. Must be a String.
 * `"school"`. An array of schools attending this lecture. Mandatory field. Must be an Array of String's.
 * `"lecturer"`. Lecturer. Mandatory field. Must be a String.
 * `"room"`. Room. Mandatory field. Must be a String.
 * `"start"`. Start time. Mandatory field. Must be a Date.
 * `"end"`. End time. Mandatory field. Must be a Date.

For example:  
```
var lecture = {
    "topic": "A Lecture Topic", 
    "school": ["A School Name"], 
    "lecturer": "A Lecturer Name", 
    "room": "A Room Name", 
    "start": new Date(2017, 7, 15, 19), 
    "end": new Date(2017, 7, 15, 21, 30)
    };  
schedule_data.set_lecture(lecture);
```  

If the field is illegal (not `topic`, `school`, `lecturer`, `room`, `start`, or `end`) or the data type does not match the allowed data type, an error will be thrown. If a mandatory field is missing, an error will be thrown.  
If the school or room is not found in the database, an error will be thrown. Enter the information about the room and school first.  
If there's time conflict for the school or room or if the room is over-capacity an error will be thrown.

## Updating existing data  
### ScheduleData.prototype.*update_school*(school_name, updated_data)

Updates the school with the `school_name` (String) according to the data specified in `updated_data` (Object). For example to change the school name and the number of enrolled students for the school "A School Name":

```
var update_school = {
"name": "A Changed School Name",
"n_students": 100
};
schedule_data.update_school("A School Name", update_school);
```
This method automatically ensures data consistency. If data consistency is violated, an Error is thrown and changes are rolled back.

### ScheduleData.prototype.*update_room*(room_name, updated_data)  
Same as ScheduleData.prototype.*update_school*

### ScheduleData.prototype.*update_lecture*(lecture_topic, updated_data)  
Same as ScheduleData.prototype.*update_school*

## Retrieving data  
### ScheduleData.prototype.*get_school*(school_name)
Returns the data for the specified `school_name` (String).

### ScheduleData.prototype.*get_room*(room_name)
Same as ScheduleData.prototype.*get_school*

### ScheduleData.prototype.*get_lecture*(lecture_topic)
same as ScheduleData.prototype.*get_school*

## Retrieving schedule

### ScheduleData.prototype.*get_school_schedule*(school_name, start_date, end_date)   
Returns the list of lectures for the specified `school_name` (String) between `start_date` (Date) and `end_date` (Date). For example:
```
var school_name = "A Changed School Name";
var start_date = new Date(2017,7,1);
var end_date = new Date(2017,8,1);
var result = schedule_data.get_school_schedule(school_name, start_date, end_date);
```
The value of `result` is 

### ScheduleData.prototype.*get_room_schedule*(room_name, start_date, end_date)  
Returns the list of lectures for the specified `room` (String) between `start_date` (Date) and `end_date` (Date).