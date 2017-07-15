SeatList = new Mongo.Collection('seats');
Questions = new Mongo.Collection('questions');

if(Meteor.isClient){
    Meteor.subscribe('theClasses');

    // window.onload = function(){
    //     console.log("setActive");
        
    //     var curIP = "129.62.150.32";
    //     // later, we'll get the actual IP address
    //     // $.getJSON('//ipapi.co/json/', function(data) {
    //     //     console.log(JSON.stringify(data, null, 2));
    //     // });


    //     // set seat session
    //     var curSeat = SeatList.findOne({ IP: curIP });
    //     console.log(SeatList);
    //     if(curSeat){
    //         console.log("found the current seat "+curSeat._id);
    //         SeatList.update({ _id: curSeat._id }, { $set: {status: "active"} });
    //         Session.set('selectedSeat', curSeat._id);
    //     }
    // }

    // window.onunload = function(){
    //     console.log("setInactive");
    //     var curSeatID = Session.get('selectedSeat');
    //     console.log(curSeatID);
    //     SeatList.update({ _id: curSeatID }, { $set: {status:"inactive"} });
    //     var thing = SeatList.findOne({ _id: curSeatID }).status;
    //     console.log(thing);
    // }

    window.onbeforeunload = function(){
        console.log("setInactive");
        // var curSeatID = Session.get('selectedSeat');
        // console.log(curSeatID);
        // SeatList.update({ _id: curSeatID }, { $set: {status:"inactive"} });
        // var thing = SeatList.findOne({ _id: curSeatID }).status;
        // console.log(thing);
        // setInactive();
    }

    // function setActive(){
    //     console.log("setactive");
    // }

    // function setInactive(){
    //     console.log("setinactive");
    // }

    // HELPER functions for the CLASSROOM LAYOUT
    Template.classroomlayout.helpers({
        'setInactive': function(){
            console.log("setInactive");
            var curSeatID = Session.get('selectedSeat');
            console.log(curSeatID);
            SeatList.update({ _id: curSeatID }, { $set: {status:"inactive"} });
            var thing = SeatList.findOne({ _id: curSeatID }).status;
            console.log(thing);
        },
        'setActive': function(){
            console.log("setActive");
            
            var curIP = "129.62.150.10";
            // later, we'll get the actual IP address
            $.getJSON('//ipapi.co/json/', function(data) {
                console.log(JSON.stringify(data, null, 2));
            });


            // set seat session
            var curSeat = SeatList.findOne({ IP: curIP });
            if(curSeat){
                console.log("found the current seat "+curSeat._id);
                SeatList.update({ _id: curSeat._id }, { $set: {status: "active"} });
                Session.set('selectedSeat', curSeat._id);
            }else{
                console.log("there was no seat to find");
            }
        },
        'seatInactive': function(){
            var seatID = Session.get('selectedSeat');
            if(seatID){
                return false;
            }else{
                return true;
            }
        },
        'aisle': function(){
            var col = SeatList.findOne({ _id: this._id }).col;
            if(col){
                if(col == 5 || col == 9 || col == 17
                    || col == 21 || col == 29 || col == 33){
                    return true;
                }else{
                    return false;
                }
            }
        },
        'rowone': function(){
            return SeatList.find({ row: 1 });
        },
        'rowtwo': function(){
            return SeatList.find({ row: 2 });
        },
        'rowthree': function(){
            return SeatList.find({ row: 3 });
        },
        'seatstatus': function(){
            // console.log("seatstatus");
            var curSeatID = this._id;
            var curSeat = SeatList.findOne({ _id: curSeatID });

            if(curSeat){
                return curSeat.status;
            }
        },
        
    });

    Template.statusbuttons.events({
        'click .good': function(event){
            console.log("good");
            var seatID = Session.get('selectedSeat');
            console.log("id: "+seatID);
            SeatList.update({ _id: seatID }, { $set: {status: "good"} });
        },
        'click .meh': function(event){
            console.log("meh");
            var seatID = Session.get('selectedSeat');
            SeatList.update({ _id: seatID }, { $set: {status: "meh"} });
        },
        'click .bad': function(event){
            console.log("bad");
            var seatID = Session.get('selectedSeat');
            SeatList.update({ _id: seatID }, { $set: {status: "bad"} });
        }
    })

    Template.questions.helpers({
        'question': function(){
            return Questions.find({}, { sort: {score:-1} });
        },
        'professor': function(){
            console.log("is this the prof?");
            var seatID = Session.get('selectedSeat');
            if(seatID){
                var curSeat = SeatList.findOne({ _id: seatID});
                console.log(curSeat);
                if(curSeat.IP == "129.62.150.10"){
                    return true;
                }else{
                    return false;
                }
            }
        }
    });

    Template.questions.events({
        'submit form': function(event){
            event.preventDefault();
            var question = event.target.question.value;
            console.log("your question is: "+question);
            
            // create a Meteor function here to insert the question

            event.target.question.value = "";
        }
    });
}