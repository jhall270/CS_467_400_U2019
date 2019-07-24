console.log("award type chart.js is loaded");


google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
	
	
	var XHR = new XMLHttpRequest();
	var URL = 'http://localhost:8800/admin/data/awardTypeCount';

	XHR.onreadystatechange = function(){
		if(XHR.readyState == 4 && XHR.status == 200){

			var rows = JSON.parse(XHR.responseText);
			console.log(rows);
			
			var formattedData = [];
			formattedData[0] = [ "Type of Award" , "Number of Type"];
			
			for (let i in rows){
				formattedData.push( [ rows[i].TypeOfAward , rows[i].numType ] );
			}
			
			console.log(formattedData);
			
				var data = google.visualization.arrayToDataTable(formattedData);

			var options = {
			  title: 'Awards By Type'
			};

			var chart = new google.visualization.PieChart(document.getElementById('piechart'));

			chart.draw(data, options);

		}
	}	
			XHR.open('GET', URL);

			XHR.send();
	

}






