//API call

var giphy = {
    topics: ["angry", "frustrated", "happy", "elated", "confused",
        "paranoid", "sarcastic", "surprised", "disgusted", "terrified",
        "enraged", "wicked", "stoned", "neurotic"],

    ajaxGiphy: function (searchTerm, salty) {
        var queryURL;
        if (searchTerm && salty) {
            queryURL = "https://api.giphy.com/v1/gifs/search" +
                "?q=" + searchTerm + "&api_key=xFg7oHr1yOvSvcjipxfVQdzeTcTpow3K&limit=100&rating=r";

        }
        else if (searchTerm) {
            queryURL = "https://api.giphy.com/v1/gifs/search" +
                "?q=" + searchTerm + "&api_key=xFg7oHr1yOvSvcjipxfVQdzeTcTpow3K&limit=10";
        }
        //default when page loads?
        else queryURL = "https://api.giphy.com/v1/gifs/trending?api_key=xFg7oHr1yOvSvcjipxfVQdzeTcTpow3K&limit=10";

        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function (response) {
            if (salty) {
                response.data.forEach(function (gif) {
                    if (gif.rating == "r") {
                        var gifDiv = $("<div class = 'gifDiv'>").html("<p>Rating: " + gif.rating + "</p>");
                        var newGif = $("<img>")
                            .attr("src", gif.images.fixed_height_still.url)
                            .attr("data-still", gif.images.fixed_height_still.url)
                            .attr("data-state", "still")
                            .attr("data-animate", gif.images.fixed_height.url)
                            .attr("class", "gif");
                        $(gifDiv).append(newGif)
                        $("#gifs").prepend(gifDiv);
                    }
                });
            }
            else {
                response.data.forEach(function (gif) {
                    var gifDiv = $("<div class = 'gifDiv'>").html("<p>Rating: " + gif.rating + "</p>");
                    var newGif = $("<img>")
                        .attr("src", gif.images.fixed_height_still.url)
                        .attr("data-still", gif.images.fixed_height_still.url)
                        .attr("data-state", "still")
                        .attr("data-animate", gif.images.fixed_height.url)
                        .attr("class", "gif");
                    $(gifDiv).append(newGif)
                    $("#gifs").prepend(gifDiv);
                });
            }
        });
    },
    ajaxWx: function (city) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather" + "?q=" + city + "&APPID=1af38fcbab6d390a11b52f1a3c19fe7f";
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                wxDesc = response.weather[0].description;
            });
        console.log(wxDesc)
    },
    playPause: function (clickedEle) {
        //clickedEle corresponds to DOM element clicked
        var state = $(clickedEle).attr("data-state");
        var still = $(clickedEle).attr("data-still");
        var animate = $(clickedEle).attr("data-animate");
        if (state == "still") {
            $(clickedEle).attr("src", animate)
                .attr("data-state", "animated");
        }
        else $(clickedEle).attr("src", still)
            .attr("data-state", "still");
    },

    fillButtons: function () {
        $("#buttons").empty();
        this.topics.forEach(function (topic) {
            var newBtn = $("<button class = 'button-primary btnSmall topicBtn' id = " + topic + ">" + topic + "</button>");
            $("#buttons").append(newBtn);
        });
    },

    addTopic: function (topic) {
        this.topics.push(topic);
        this.fillButtons();
    }



}


$(document).ready(function () {
    giphy.fillButtons();
    giphy.ajaxGiphy();
    $(document).on("click", ".topicBtn", function () {
        if ($("#salty").prop("checked")) {
        giphy.ajaxGiphy($(this).attr("id"), true);
        }
        else giphy.ajaxGiphy($(this).attr("id"));
    });
    $(document).on("click", ".gif", function () {
        giphy.playPause(this);

    })
    $("#addBtn").on("click", function () {
        giphy.addTopic($("#newTopic").val());

    });
});

