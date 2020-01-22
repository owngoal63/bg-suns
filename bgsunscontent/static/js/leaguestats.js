// Check for Browser - Chrome is best option
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;    // Opera 8.0+

var isFirefox = typeof InstallTrigger !== 'undefined';  // Firefox 1.0+

var isSafari = /constructor/i.test(window.HTMLElement) || (function(p) {
    return p.toString() === "[object SafariRemoteNotification]";
})(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)); // Safari 3.0+ "[object HTMLElementConstructor]" 

var isIE = /*@cc_on!@*/ false || !!document.documentMode;   // Internet Explorer 6-11

var isEdge = !isIE && !!window.StyleMedia;  // Edge 20+

//var isChrome = !!window.chrome && !!window.chrome.webstore; // Chrome 1+
var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

var isBlink = (isChrome || isOpera) && !!window.CSS;    // Blink engine detection

// End of Check for Browser Code

if (isChrome) {
    var t2WBarColour = "rgb(223,105,26, 0.7)" // Box colour for tracked teams (includes transparency for Chrome)
    var regBarColour = "rgb(0,0,0,0.6)" // Box colour for nontracked teams (includes transparency for Chrome)
} else {
    var t2WBarColour = "lightgreen" // Box colour for tracked teams (no transparency for other browsers)
    var regBarColour = "grey" // Box colour for nontracked teams (no transparency for other browsers)
    var t2WBarColour = "rgb(228,214,140, 0.7)" // Box colour for tracked teams (includes transparency for Chrome)
    var regBarColour = "rgb(0,0,0,0.6)" // Box colour for nontracked teams (includes transparency for Chrome)
}



(function() {

    // Multiple configuration variables to provide maximum flexibility in design of Tracker output
    var rectWidth = 200                     // Width of team boxes
    var spacer = 3                          // Horizontal spacer between team boxes (px)
    var barPadding = 0.1                    // Vertical Padding in the rectangular bars
    var maxTeams2Track = 3                  // Max no. of teams that can be selected to track
    
    var t2WTextColour = "Black"             // Team to watch name text colour
    var regTextColour = "White"             // Non tracked team name text colour
    
    var marginTop = 20                      // SVG Margin Top setting
    var marginRight = 40                    // SVG Margin Right setting
    var marginBottom = 10                   // SVG Margin Bottom setting
    var marginLeft = 40                     // SVG Margin Left setting
    
    var imagePosx = 5                       // Image Position offset from edge of bar (px)
    
    var textOffsetx = 50                    // Text Position offset from edge of bar (px)
    var textOffsety = 5                     // Text Position offset from top of bar (px)
    
    var textAnchor = "left"                 // Text Anchor attribute
    var textFontFamily = "sans-serif"       // Text Font Family attribute
    var textFontSize = "14px"               // Text Font Size
    
    var imageWidth = 40                     // Image width 
    var imageHeight = 40                    // Image height
    var imageOffsety = 20                   // Image Position offset in y axis
    
    var colTexty = 505                      // Column text y position
    var colTextOffsetx=55                   // Column text x offset position
    var colTextPrefix = "Week-"             // Column text prefix string
    
    var animationSpeed = 1750               // Overall Bar animation speed (ms)
    var delaySpeed = 50                     // Animation delay speed
    
    var JSONFile = "/static/js/leaguestats.json";         // JSON data file to load
    var team2Watch = ["BG Suns"];    // Array of Initial teams to be tracked in selection box
    
    var seriesTransitionType = "Horizontal"     // Set to "Horizontal" for transitions across x-axis. Set to "Vertical" for single column transitions
    var seriesModel = "Regular"            // Set to "Cumulative" for Cumulative data sorting e.g. Goals. Set to "Regular" for position sorting
    
    // Initialisation variables
    var isSorted = false;                   // Initial Sort status of bars
    var page_svg;                           // Webpage Scalable Vector Graphics (SVG) variable
    


    // Open and read JSON data file using Callback mechanism to ensure completion before continuing execution
    d3.queue()
        .defer(d3.json, JSONFile)
        .await(ready)

    // Main function for script
    function ready(error, datapoints) {
        
        //console.log(datapoints);
        
        // Get JSON key names and store in the array "keys"
        // Perhaps enhance and use name for future release ?
        var a = datapoints[0];
        
        var keys = []
        for(var k in a){
            keys.push(k)
        }
        
        var totalWeeks = keys.length - 4;       // Total number of weeks data in JSON ( minus 4 keys to exclude "id","team","ground" & "manager")
        //var totalWeeks = 38;

        if ( seriesModel == "Cumulative") {
            // Add a final Cumulative key element if summation sorting
            for (var data of datapoints) {
                data.cumSum = sumElem(data, "v1");
                console.log(data);
            }
            // Sort the array into the initial position order and assign data array to the variable "data"
            //var data = sortByKeyReverse(datapoints,"cumSum");
        } else {
            //var data = sortByKey(datapoints,"v1");
        }    

        var data = sortByKey(datapoints,"v1");

        // Determine number of teams in data
        var numTeams = data.length;

        // Initialise settings for Scalable Vector Graphics on HTML page
        var svg = d3.select("svg"),
            margin = {
                top: marginTop,
                right: marginRight,
                bottom: marginBottom,
                left: marginLeft
            },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom - 20;
        page_svg = svg;

        // Initialise y scaled screen positions within the SVG area 
        var y = d3.scaleBand().range([0, height]);

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
        // Add the Y-axis to the SVG
        var yaxis = d3.scaleBand().range([0, height]);
        //console.log(yaxis);
        yaxis.domain(data.map(function(d) {
            // console.log(d.id);
            return d.v1;
        }));

        g.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yaxis));
            
        if ( seriesModel == "Cumulative") {
            var data = sortByKeyReverse(datapoints,"cumSum");
            // console.log(data);
        }

        // Start of Code section for the initial data column position     
            
        // Set the y input values based upon the JSON Data for the initial week position
        y.domain(data.map(function(d) {
            return d.id;
        })).padding(barPadding);
            
        // Update the Initial text on the "move forward" button
        d3.select("#weekBtn").text(colTextPrefix + "1")    

        // Add the background bars for the initial league positions
        g.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("height", y.bandwidth())
            .attr("y", function(d) {
                return y(d.id);
            })
            .attr("width", rectWidth)
            .attr("fill", function(d) {
                if (team2Watch.includes(d.team)) return t2WBarColour;
                else {
                    return regBarColour;
                }
            })

        // Add teamnames to the initial league positions
        g.selectAll(".text")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "text")
            .text(function(d) {
                if ( seriesModel == "Cumulative") {
                    return d.team + " " + d.cumSum ;
                } else {    
                return d.team;
                }
            })
            .attr("x", textOffsetx)
            .attr("y", function(d) {
                return y(d.id) + (y.bandwidth() / 2) + textOffsety;
            })
            .attr("text-anchor", textAnchor)
            .attr("font-family", textFontFamily)
            .attr("font-size", textFontSize)
            .attr("fill", function(d) {
                if (team2Watch.includes(d.team)) {
                    return t2WTextColour;
                } else {
                    return regTextColour;
                }
            });

        // Add images to the initial league positions
        g.selectAll(".image")
            .data(data)
            .enter()
            .append("image")
            .attr("class", "image")
            .attr("xlink:href", function(d) {
                return "/static/images/" + d.team + ".png"
            })
            .attr("x", imagePosx)
            .attr("y", function(d) {
                return y(d.id) + (y.bandwidth() / 2) - imageOffsety;
            })
            .attr("width", imageWidth)
            .attr("height", imageHeight);

        // Add the column text for the initial Week No.
        g.append("text")
            .attr("class", "textWeekNum")
            .text(colTextPrefix + "1")
            .attr("x", colTextOffsetx)
            .attr("y", colTexty)
            .attr("font-family", textFontFamily)
            .attr("font-size", textFontSize);
            
        // End of Code for the initial data column position         
        

        // Start of code to handle the team2watch selection
        var selector = d3.select('#team-selector');

        // Create array with teamNames sorted alphabetically
        var teamNames = data.map(function(d) {
            return d.team;
        }).sort();
        
        var teamSelect = selector
            .append('select')
            .attr('class', 'select')
            .attr('multiple', '')
            .attr("size", "20")
            .on('change', function(d) {
                var s = teamOptions.filter(function(d) {
                    return this.selected;
                });
                if (s.nodes().length >= maxTeams2Track) {
                    teamOptions.filter(function() {
                            return !this.selected
                        })
                        .property('disabled', true);
                } else {
                    teamOptions.property('disabled', false);
                }
            });

        var selectedValues = [];
        var teamOptions = teamSelect
            .selectAll('option')
            .data(teamNames)
            .enter()
            .append('option')
            .text(function(d) {
                return d;
            })
            .attr("selected", function(d) {
                if (team2Watch.includes(d)) {
                    //console.log(d)
                    return "selected";
                }
            })

        d3.select('#SelectBtn')
            .on('click', function(d) {
                var v = teamOptions.filter(function(d) {
                    return this.selected;
                }).data();
                team2Watch = v;
                updateTeam2Watch();
            });


        function updateTeam2Watch() {
            g.selectAll(".bar")
                .attr("fill", function(d) {
                    if (team2Watch.includes(d.team)) {
                        return t2WBarColour;
                    } else {
                        return regBarColour;
                    }
                });

            g.selectAll(".text")
                .attr("fill", function(d) {
                    if (team2Watch.includes(d.team)) {
                        return "black";
                    } else {
                        return "white";
                    }
                });

            var i;
            for (i = 1; i <= totalWeeks; i++) {
                g.selectAll(".bar" + i)
                    .attr("fill", function(d) {
                        if (team2Watch.includes(d.team)) {
                            return t2WBarColour;
                        } else {
                            return regBarColour;
                        }
                    });
                g.selectAll(".text" + i)
                    .attr("fill", function(d) {
                        if (team2Watch.includes(d.team)) {
                            return "black";
                        } else {
                            return "white";
                        }
                    });
            }
        }
        // End of code to handle the team2watch selection

        // Function to copy and transform (animated move) the current weeks position to the new position
        function copyandTransform(z, col) {

            console.log(z);

            if (seriesTransitionType == "Horizontal") {
                
                
                // If Cumulative Sum is required update the values in the object
                if ( seriesModel == "Cumulative") {
                    // Update the final Cumulative key element if summation sorting
                    for (var datax of data) {
                        datax.cumSum = sumElem(datax, z);
                        console.log(datax);
                    }
                }


                // Copy the bars of the current week
                g.selectAll(".bar" + col)
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar" + col)
                    .attr("x", rectWidth * (col - 1) + ((col - 1) * spacer))
                    .attr("height", y.bandwidth())
                    .attr("y", function(d) {
                        return y(d.id);
                    })
                    .attr("width", rectWidth)
                    .attr("fill", function(d) {
                        if (team2Watch.includes(d.team)) return t2WBarColour;
                        else {
                            return regBarColour;
                        }
                    });

                // Copy the text of the current week
                g.selectAll(".text" + col)
                    .data(data)
                    .enter()
                    .append("text")
                    .attr("class", "text" + col)
                    .text(function(d) {
                        if ( seriesModel == "Cumulative") {
                            return d.team + " +" + d[z] + " " + d.cumSum;
                            //return d.team + " (" + d[z] + ")";
                        } else {    
                        return d.team;
                        }
                    })
                    .attr("x", rectWidth * (col - 1) + ((col - 1) * spacer) + textOffsetx)
                    .attr("y", function(d) {
                        return y(d.id) + (y.bandwidth() / 2) + textOffsety;
                    })
                    .attr("text-anchor", textAnchor)
                    .attr("font-family", textFontFamily)
                    .attr("font-size", textFontSize)
                    .attr("fill", function(d) {
                        if (team2Watch.includes(d.team)) {
                            return t2WTextColour;
                        } else {
                            return regTextColour;
                        }
                    });
    
                // Copy the images of the current week
                g.selectAll(".image" + col)
                    .data(data)
                    .enter()
                    .append("image")
                    .attr("class", "image" + col)
                    .attr("xlink:href", function(d) {
                        return "/static/images/" + d.team + ".png"
                    })
                    .attr("x", rectWidth * (col - 1) + ((col - 1) * spacer) + imagePosx)
                    .attr("y", function(d) {
                        return y(d.id) + (y.bandwidth() / 2) - imageOffsety;
                    })
                    .attr("width", imageWidth)
                    .attr("height", imageHeight);
            }  
            

                
            if ( seriesModel == "Cumulative") {    
                // Sort and copy the array into the new positions
                var x0 = y.domain(data.sort(isSorted ?
                    function(a, b) {    
                            return a["cumSum"] + b["cumSum"];
                            } :
                            function(a, b) {
                                return d3.descending(a["cumSum"], b["cumSum"]);
                            })
                        .map(function(d) {
                            return d.id;
                        }))
                    .copy();
            } else {
            // Sort and copy the array into the new positions
            var x0 = y.domain(data.sort(isSorted ?
                function(a, b) {    
                        return b[z] - a[z];
                        } :
                        function(a, b) {
                            return d3.ascending(a[z], b[z]);
                        })
                    .map(function(d) {
                        return d.id;
                    }))
                .copy();
            }    
                //console.log(data);

            //Define the transition speeds
            var transition = page_svg.transition().duration(animationSpeed),
                delay = function(d, i) {
                    return i * delaySpeed;
                };
          
            //Move the bars
            transition.selectAll(".bar" + col)
                .delay(delay)
                .attr("x", function(d) {
                if (seriesTransitionType == "Horizontal") return (rectWidth * col) + (col * spacer);
                if (seriesTransitionType == "Vertical") return 0;    
                })
                .attr("y", function(d) {
                    return x0(d.id);
                });

            // Move the text
            transition.selectAll(".text" + col)
                .delay(delay)
                .attr("x", function(d) {
                if (seriesTransitionType == "Horizontal") return (rectWidth * col) + (col * spacer) + textOffsetx;
                if (seriesTransitionType == "Vertical") return textOffsetx;    
                })
                .attr("y", function(d) {
                    return x0(d.id) + (y.bandwidth() / 2) + textOffsety;
                });

            // Move the images
            transition.selectAll(".image" + col)
                .delay(delay)
                .attr("x", function(d) {
                if (seriesTransitionType == "Horizontal") return (rectWidth * col) + (col * spacer) + imagePosx;
                if (seriesTransitionType == "Vertical") return imagePosx;    
                })
                .attr("y", function(d) {
                    return x0(d.id) + (y.bandwidth() / 2) - imageOffsety;
                });

            // Add the column text for the current Week No.
            g.append("text")
                .attr("class", "textWeekNum")
                .text(colTextPrefix + (col + 1).toString())
                .attr("x", (rectWidth * col) + (col * spacer) + colTextOffsetx)
                .attr("y", colTexty)
                .attr("font-family", textFontFamily)
                .attr("font-size", textFontSize);

        }

        // Function to return Best Improvement and Worst Deterioration between the first "v1" and last week of data
        function BestAndWorstPerformers(s,z) {

            var x0 = data.sort(function(a, b) {
                    return d3.ascending(a[s] - a[z], b[s] - b[z]);
                })
                .map(function(d) {
                    return d.team;
                });
            var retArray = [];
            retArray.push(x0[x0.length - 1]);   // Best improvement team array pos [0]
            retArray.push(x0[0]);               // Worst deterioration team array pos[1]
            return retArray;
        }

        function TopPositionThisWeek(s) {

            var x0 = sortByKeyReverse(data,s);
            console.log(x0);
            return x0[0].team;
        }

        // Function to compare positional changes between first week and last week of data for each team
        // Which teams "Improved", "Deteriorated" and "RemainedSame"
        function TeamProgress(type, s, z) {

            switch (type) {
                case "Improved":
                    var x0 = data.sort(function(a, b) {
                            return d3.ascending(a[s] - a[z], b[s] - b[z]);
                        })
                        .filter(function(d) {
                            return (d[s] - d[z]) > 0
                        })
                        .map(function(d) {
                            return d.team;
                        });
                    break;
                case "Deteriorated":
                    var x0 = data.sort(function(a, b) {
                            return d3.ascending(a[s] - a[z], b[s] - b[z]);
                        })
                        .filter(function(d) {
                            return (d[s] - d[z]) < 0
                        })
                        .map(function(d) {
                            return d.team;
                        });
                    break;
                case "RemainedSame":
                    var x0 = data.sort(function(a, b) {
                            return d3.ascending(a[s] - a[z], b[s] - b[z]);
                        })
                        .filter(function(d) {
                            return (d[s] - d[z]) == 0
                        })
                        .map(function(d) {
                            return d.team;
                        });
            }

            // Populate the return array with the teams for each case "Improved","Deteriorated" and "RemainSame" 
            var retArray = [];
            var i;
            for (i = 0; i < x0.length; i++) {
                retArray.push(x0[i]);
            }
            return retArray;
        }
        
        function overallTeamSeasonStats(t) {
            
            var retArray = [];
            
            var teamSeasonObj = data.filter(({team}) => team === t);            // filter JSON for team season data
            var teamSeasonArray = Object.keys(teamSeasonObj[0]).map(function(_) { return teamSeasonObj[0][_]; })        // Convert record to Array
    
            console.log(teamSeasonObj);
            console.log(teamSeasonArray);
            
            // Initialise multiple counter and sum variables 
            var lowestPos = numTeams;
            var highestPos = 1;
            var sumOfPositionsFull = 0;
            var sumOfPositionsQ1 = 0;
            var sumOfPositionsQ2 = 0;
            var sumOfPositionsQ3 = 0;
            var sumOfPositionsQ4 = 0;
            var weeksinTopHalf = 0;
            var weeksinBottomHalf = 0;
            
            // Loop through each index value in array and perform calculations ( + 2 on loop to account for "id" and "team" at index [0] and [1] respectively  
            teamSeasonArray.forEach(function (weekval,index) {
                if (index > 1 && index <= totalWeeks + 2 ) {
                    //console.log(weekval);
                    if (weekval > lowestPos ) lowestPos = weekval;
                    if (weekval < highestPos ) highestPos = weekval;
                    if (index > 1 && index < 11) sumOfPositionsQ1 += weekval;
                    if (index > 10 && index < 20) sumOfPositionsQ2 += weekval;
                    if (index > 19 && index < 29) sumOfPositionsQ3 += weekval;
                    if (index > 28 && index < totalWeeks) sumOfPositionsQ4 += weekval;
                    if (weekval <= 10) { weeksinTopHalf ++ } else { weeksinBottomHalf ++ }
                    
                    sumOfPositionsFull += weekval;
                }    
            });
            
            // Calculate multiple Average stats
            var avPositionFull = Math.round(sumOfPositionsFull / totalWeeks);
            var avPositionQ1 = Math.round(sumOfPositionsQ1 / 9);
            var avPositionQ2 = Math.round(sumOfPositionsQ2 / 10);
            var avPositionQ3 = Math.round(sumOfPositionsQ3 / 9);
            var avPositionQ4 = Math.round(sumOfPositionsQ4 / 10);       
            var avPositionH1 = Math.round((sumOfPositionsQ1 + sumOfPositionsQ2) / 19);
            var avPositionH2 = Math.round((sumOfPositionsQ3 + sumOfPositionsQ4) / 19);      
            
            console.log("Low/High");
            console.log(lowestPos);
            console.log(highestPos);
            console.log("Av Pos - Season and by Quarter");
            console.log(avPositionFull);
            console.log(avPositionQ1);
            console.log(avPositionQ2);
            console.log(avPositionQ3);
            console.log(avPositionQ4);
            console.log("Av Pos - Season by Halfs");
            console.log(avPositionH1);
            console.log(avPositionH2);
            console.log("Weeks in Top/Bottom Half");        // Pie chart display ??
            console.log(weeksinTopHalf);
            console.log(weeksinBottomHalf);
            
            return teamSeasonArray;
            
        }
        
        function teamTrackingStats(t, weekNo) {
            
            var retArray = [];
            var numTeams = data.length;                         // Determine number of teams in data
            var teamSeasonObj = data.filter(({team}) => team === t);        // filter JSON for team season data
            var teamSeasonArray = Object.keys(teamSeasonObj[0]).map(function(_) { return teamSeasonObj[0][_]; })    // Convert record to Array
            var teamCurrentPos = teamSeasonArray[weekNo + 2]                // assign current position in array to variable ( + 2 to account for "id" and "team")
            //console.log(teamCurrentPos);
            
            const ChampionsLeaguePos = 4;
            const EuropaLeaguePos = 6;
            const RelegationPos = 18;
            
            // Mutiple conditionals comparing current position with Qualification and relegation
            
            if (teamCurrentPos == 1) { 
                retArray.push("are top of the league and in a Champions League qualifying position!")
                retArray.push("are " + (RelegationPos - teamCurrentPos).toString() + " away from the relegation zone");
            }
            if (teamCurrentPos <= ChampionsLeaguePos && teamCurrentPos != 1 ) { 
                retArray.push("are in a Champions League and Europa League qualifying position!")
                retArray.push("are " + (RelegationPos - teamCurrentPos).toString() + " away from the relegation zone");
            }
            if (teamCurrentPos <= EuropaLeaguePos && teamCurrentPos > ChampionsLeaguePos ) { 
                retArray.push("are in a Europa League qualifying position and " + (teamCurrentPos - ChampionsLeaguePos.toString()) + " from a Champions League qualifying position!")
                retArray.push("are " + (RelegationPos - teamCurrentPos).toString() + " away from the relegation zone");
            }
            if (teamCurrentPos > EuropaLeaguePos && teamCurrentPos < RelegationPos ) { 
                retArray.push("are " + (teamCurrentPos - EuropaLeaguePos.toString()) + " away from a Europa League qualifying position!")
                retArray.push("are " + (RelegationPos - teamCurrentPos).toString() + " away from the relegation zone");
            }
            if (teamCurrentPos > EuropaLeaguePos && teamCurrentPos >= RelegationPos && teamCurrentPos != numTeams ) { 
                retArray.push("are " + (teamCurrentPos - EuropaLeaguePos.toString()) + " away from a Europa League qualifying position!")
                retArray.push("are in the relegation zone of the league");
            }
            if (teamCurrentPos == numTeams ) { 
                retArray.push("are " + (teamCurrentPos - EuropaLeaguePos.toString()) + " away from a Europa League qualifying position!")
                retArray.push("are at the bottom of the league table");
            }
            
            // Get the team ground and the manager
            var teamGround = teamSeasonArray[totalWeeks + 2];                // assign current position in array to variable ( + 2 to account for "id" and "team")
            var teamManager = teamSeasonArray[totalWeeks + 2 + 1];
            //console.log(teamGround);
            //console.log(teamManager);
            retArray.push(teamGround);
            retArray.push(teamManager);
            
            return retArray;
        }

        // Code for Week-x button clicked event
        d3.select("#weekBtn").on("click", function() {
            var wNum = parseInt(d3.select(this).text().split('-')[1]);          // Assign the postfix number of the #weekBtn text to wNum e.g. Week-x
            //console.log(wNum);
            if (wNum >= totalWeeks) {                                           // No more data to display - execute the summary popup
                var BestWorst = BestAndWorstPerformers("v1","v" + totalWeeks.toString());   // Find the best and worst between the first week (v1) and the last week v(totalWeeks)
                var TeamsImproved = TeamProgress("Improved", "v1", "v" + totalWeeks.toString());
                var TeamsDeteriorated = TeamProgress("Deteriorated", "v1", "v" + totalWeeks.toString());
                var TeamsSame = TeamProgress("RemainedSame", "v1", "v" + totalWeeks.toString());

                alert(totalWeeks + " weeks is the end of the 2018-19 season.\n\n" +
                    "The following teams have improved their position since the start of the season: " + TeamsImproved + ".\n\n" +
                    "The following teams have worsened their position since the start of the season: " + TeamsDeteriorated + ".\n\n" +
                    "The following teams are in the same position as they started the season: " + TeamsSame + ".\n\n" +
                    "Overall " + BestWorst[0] + " have been the best improvers since the start of the season and " +
                    BestWorst[1] + " have deteriorated the most.");
            } else {
                var TopPosition = TopPositionThisWeek("v" + (wNum + 1).toString());
                d3.select(this).text(colTextPrefix + (wNum + 1).toString())     // Increment the postfix number of the #weekBtn e.g. Week-(+1)
                var BestWorstWeekly = BestAndWorstPerformers("v" + wNum.toString() ,"v" + (wNum + 1).toString());   // Who are the best/worst since last week
                console.log(BestWorstWeekly)
                //d3.selectAll(".weeklyImprovement")
                    if ( seriesModel == "Cumulative") {
                        d3.selectAll(".weeklyImprovement")
                            .text(colTextPrefix + (wNum + 1).toString() + ": " + TopPosition + " is the top scorer this week. ")
                    } else {
                        d3.selectAll(".weeklyImprovement")
                            .text(colTextPrefix + (wNum + 1).toString() + ": " + BestWorstWeekly[0] + " are the best improvers on last week. " + BestWorstWeekly[1] + " have deteriorated the most.")
                    }    
                copyandTransform("v" + (wNum + 1).toString(), wNum);       // Execute the next week's data copy and transform function
                
                var teamInfo
                team2Watch.forEach(function (t,index) {
                    teamInfo = teamTrackingStats(t, wNum);
                    console.log(teamInfo);
                    console.log(t);
                    d3.select("#team-name-" + index.toString()).text(t);
                    d3.select("#team-status-"+ index.toString()).text(t + " " + teamInfo[0] + " They " + teamInfo[1]);
                    //d3.select("#team-image-0").attr("xlink:href","images/" + t + ".PNG")
                    d3.select("#team-image-"+ index.toString()).attr("src","images/" + t + ".png")
                    d3.select("#team_ground-" + index.toString()).text("Ground:" + teamInfo[2]);
                    d3.select("#team_manager-" + index.toString()).text("Manager:" + teamInfo[3]);
                    
                    //.attr("xlink:href", function(d) {
                    //return "images/" + d.team + ".PNG"
                    
                });
            
                
                
                //console.log(teamInfo);
                //console.log(team2Watch);
                d3.selectAll(".weeklyTeamTracking")
                    .text("AFC Bournemouth " + teamInfo[0] + " They " + teamInfo[1]);
                
                // To be used at end of season
                //overallTeamSeasonStats("AFC Bournemouth");
                
            }
        });
        
        function sortByKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }

        function sortByKeyReverse(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });
        }

        function sumElem( obj , curElem) {
            var sum = 0;
            for( var el in obj ) {
                if( typeof obj[el] == "number" && el != "id"  ) {
                    if( el == curElem ) {
                        sum += parseFloat( obj[el] );
                        break;
                    }
                    sum += parseFloat( obj[el] );
                }
            }
            return sum;
          }

    }

})();