let sample1;
let sample2;
let sample3;
let data = [];
let counter = 0;
let scaleX;
let scaleY;
let colorCountry;
let radiusCountry;
let curveCountry = [];
let year;
let values = [];
let yearcountry;
let intervalId;
const colorMap = new Map();
let textAttributes = {
     'id': 'txtid',
     'x': 900,
     'y':100,
     'lengthAdjust':'spacingAndGlyphs',
     'font-size':30,
     'font-family':'sans-serif',
     'font-weight':1000, 
} 

let Tooltip = d3.select("#my_line")
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "1px")
          .style("border-radius", "5px")
          .style("padding", "5px")
          .style("position", "absolute");

let dim = {
    'width': 1000, 
   'height':1000, 
   'margin':50   
};


  
let svg = d3.select("#chart1").append("svg")  
     .attrs(dim);

     
     
let g = svg.append("g");      
     
     


let div = d3.select("body")
             .append("div")
             .attr("class", "tooltip")
             .style("opacity", 0);


function processSheets() {

     Promise.all([
          fetch("./country_data_life.csv")
               .then(function(resp){
               return resp.text();
               })            
               .then(function(data){
               sample1 = $.csv.toArrays(data).slice(1);
               
               }),
          fetch("./country_data_fertility.csv")
               .then(function(resp){
               return resp.text();
               })            
               .then(function(data){
               sample2 = $.csv.toArrays(data).slice(1); 
                        
               }),
           fetch("./country_pop.csv")
               .then(function(resp){
               return resp.text();
               })            
               .then(function(data){
               sample3 = $.csv.toArrays(data).slice(1); 
                        
               })          
     ]).then((resp) =>{
          let i = 0; 
          let j = 2;
          let z = 2;

          sample1.forEach(element => {
               data.push({
                    country: element[0],
                    code: element[1],
                    life: {
                         1960:parseFloat(element[2]), 
                         1961:parseFloat(element[3]), 
                         1962:parseFloat(element[4]), 
                         1963:parseFloat(element[5]), 
                         1964:parseFloat(element[6]), 
                         1965:parseFloat(element[7]), 
                         1966:parseFloat(element[8]), 
                         1967:parseFloat(element[9]), 
                         1968:parseFloat(element[10]), 
                         1969:parseFloat(element[11]), 
                         1970:parseFloat(element[12]), 
                         1971:parseFloat(element[13]), 
                         1972:parseFloat(element[14]), 
                         1973:parseFloat(element[15]), 
                         1974:parseFloat(element[16]), 
                         1975:parseFloat(element[17]), 
                         1976:parseFloat(element[18]), 
                         1977:parseFloat(element[19]), 
                         1978:parseFloat(element[20]), 
                         1979:parseFloat(element[21]), 
                         1980:parseFloat(element[22]), 
                         1981:parseFloat(element[23]), 
                         1982:parseFloat(element[24]), 
                         1983:parseFloat(element[25]), 
                         1984:parseFloat(element[26]), 
                         1985:parseFloat(element[27]), 
                         1986:parseFloat(element[28]), 
                         1987:parseFloat(element[29]), 
                         1988:parseFloat(element[30]), 
                         1989:parseFloat(element[31]), 
                         1990:parseFloat(element[32]), 
                         1991:parseFloat(element[33]), 
                         1992:parseFloat(element[34]), 
                         1993:parseFloat(element[35]), 
                         1994:parseFloat(element[36]), 
                         1995:parseFloat(element[37]), 
                         1996:parseFloat(element[38]), 
                         1997:parseFloat(element[39]), 
                         1998:parseFloat(element[40]), 
                         1999:parseFloat(element[41]), 
                         2000:parseFloat(element[42]), 
                         2001:parseFloat(element[43]), 
                         2002:parseFloat(element[44]), 
                         2003:parseFloat(element[45]), 
                         2004:parseFloat(element[46]), 
                         2005:parseFloat(element[47]), 
                         2006:parseFloat(element[48]), 
                         2007:parseFloat(element[49]), 
                         2008:parseFloat(element[50]), 
                         2009:parseFloat(element[51]), 
                         2010:parseFloat(element[52]), 
                         2011:parseFloat(element[53]), 
                         2012:parseFloat(element[54]), 
                         2013:parseFloat(element[55])
                    },
                    fertility: {
                         1960:parseFloat(sample2[i][j++]), 
                         1961:parseFloat(sample2[i][j++]), 
                         1962:parseFloat(sample2[i][j++]), 
                         1963:parseFloat(sample2[i][j++]), 
                         1964:parseFloat(sample2[i][j++]), 
                         1965:parseFloat(sample2[i][j++]), 
                         1966:parseFloat(sample2[i][j++]), 
                         1967:parseFloat(sample2[i][j++]), 
                         1968:parseFloat(sample2[i][j++]), 
                         1969:parseFloat(sample2[i][j++]), 
                         1970:parseFloat(sample2[i][j++]), 
                         1971:parseFloat(sample2[i][j++]), 
                         1972:parseFloat(sample2[i][j++]), 
                         1973:parseFloat(sample2[i][j++]), 
                         1974:parseFloat(sample2[i][j++]), 
                         1975:parseFloat(sample2[i][j++]), 
                         1976:parseFloat(sample2[i][j++]), 
                         1977:parseFloat(sample2[i][j++]), 
                         1978:parseFloat(sample2[i][j++]), 
                         1979:parseFloat(sample2[i][j++]), 
                         1980:parseFloat(sample2[i][j++]), 
                         1981:parseFloat(sample2[i][j++]), 
                         1982:parseFloat(sample2[i][j++]), 
                         1983:parseFloat(sample2[i][j++]), 
                         1984:parseFloat(sample2[i][j++]), 
                         1985:parseFloat(sample2[i][j++]), 
                         1986:parseFloat(sample2[i][j++]), 
                         1987:parseFloat(sample2[i][j++]), 
                         1988:parseFloat(sample2[i][j++]), 
                         1989:parseFloat(sample2[i][j++]), 
                         1990:parseFloat(sample2[i][j++]), 
                         1991:parseFloat(sample2[i][j++]), 
                         1992:parseFloat(sample2[i][j++]), 
                         1993:parseFloat(sample2[i][j++]), 
                         1994:parseFloat(sample2[i][j++]), 
                         1995:parseFloat(sample2[i][j++]), 
                         1996:parseFloat(sample2[i][j++]), 
                         1997:parseFloat(sample2[i][j++]), 
                         1998:parseFloat(sample2[i][j++]), 
                         1999:parseFloat(sample2[i][j++]), 
                         2000:parseFloat(sample2[i][j++]), 
                         2001:parseFloat(sample2[i][j++]), 
                         2002:parseFloat(sample2[i][j++]), 
                         2003:parseFloat(sample2[i][j++]), 
                         2004:parseFloat(sample2[i][j++]), 
                         2005:parseFloat(sample2[i][j++]), 
                         2006:parseFloat(sample2[i][j++]), 
                         2007:parseFloat(sample2[i][j++]), 
                         2008:parseFloat(sample2[i][j++]), 
                         2009:parseFloat(sample2[i][j++]), 
                         2010:parseFloat(sample2[i][j++]), 
                         2011:parseFloat(sample2[i][j++]), 
                         2012:parseFloat(sample2[i][j++]), 
                         2013:parseFloat(sample2[i][j++])
                    },
                    population: {
                         1960:parseFloat(sample3[i][z++]), 
                         1961:parseFloat(sample3[i][z++]), 
                         1962:parseFloat(sample3[i][z++]), 
                         1963:parseFloat(sample3[i][z++]), 
                         1964:parseFloat(sample3[i][z++]), 
                         1965:parseFloat(sample3[i][z++]), 
                         1966:parseFloat(sample3[i][z++]), 
                         1967:parseFloat(sample3[i][z++]), 
                         1968:parseFloat(sample3[i][z++]), 
                         1969:parseFloat(sample3[i][z++]), 
                         1970:parseFloat(sample3[i][z++]), 
                         1971:parseFloat(sample3[i][z++]), 
                         1972:parseFloat(sample3[i][z++]), 
                         1973:parseFloat(sample3[i][z++]), 
                         1974:parseFloat(sample3[i][z++]), 
                         1975:parseFloat(sample3[i][z++]), 
                         1976:parseFloat(sample3[i][z++]), 
                         1977:parseFloat(sample3[i][z++]), 
                         1978:parseFloat(sample3[i][z++]), 
                         1979:parseFloat(sample3[i][z++]), 
                         1980:parseFloat(sample3[i][z++]), 
                         1981:parseFloat(sample3[i][z++]), 
                         1982:parseFloat(sample3[i][z++]), 
                         1983:parseFloat(sample3[i][z++]), 
                         1984:parseFloat(sample3[i][z++]), 
                         1985:parseFloat(sample3[i][z++]), 
                         1986:parseFloat(sample3[i][z++]), 
                         1987:parseFloat(sample3[i][z++]), 
                         1988:parseFloat(sample3[i][z++]), 
                         1989:parseFloat(sample3[i][z++]), 
                         1990:parseFloat(sample3[i][z++]), 
                         1991:parseFloat(sample3[i][z++]), 
                         1992:parseFloat(sample3[i][z++]), 
                         1993:parseFloat(sample3[i][z++]), 
                         1994:parseFloat(sample3[i][z++]), 
                         1995:parseFloat(sample3[i][z++]), 
                         1996:parseFloat(sample3[i][z++]), 
                         1997:parseFloat(sample3[i][z++]), 
                         1998:parseFloat(sample3[i][z++]), 
                         1999:parseFloat(sample3[i][z++]), 
                         2000:parseFloat(sample3[i][z++]), 
                         2001:parseFloat(sample3[i][z++]), 
                         2002:parseFloat(sample3[i][z++]), 
                         2003:parseFloat(sample3[i][z++]), 
                         2004:parseFloat(sample3[i][z++]), 
                         2005:parseFloat(sample3[i][z++]), 
                         2006:parseFloat(sample3[i][z++]), 
                         2007:parseFloat(sample3[i][z++]), 
                         2008:parseFloat(sample3[i][z++]), 
                         2009:parseFloat(sample3[i][z++]), 
                         2010:parseFloat(sample3[i][z++]), 
                         2011:parseFloat(sample3[i][z++]), 
                         2012:parseFloat(sample3[i][z++]), 
                         2013:parseFloat(sample3[i][z++])
                    }                  
               })               

         
               i++;
               j = 2;
               z = 2;
          });    

     }).then((resp)=>{
          drawAxis(data);
     })
     .then((resp) =>{

          let pop = document.getElementById("popup");

          pop.innerHTML += `<button id="animate">Animate</button>`;

          data.forEach(element => {
               pop.innerHTML += `<label class="countrylabel" for="${element.country}"> <input type="checkbox" name="ctry" value="${element.country}" class="countrybox">${element.country}</label>`
          })

 
          //let temp = data.slice(5,6)
 
          draw(data);

     }).then((resp) =>{
          document.getElementById("animate").addEventListener('click', function(){

               document.getElementById("popup").style.opacity = 0;

               svg.selectAll('circle').remove();
               svg.selectAll('#pathid').remove();
               svg.selectAll('rect').remove();
               clearInterval(intervalId);
               let checkboxes = document.querySelectorAll('input[name="ctry"]:checked');
          
               checkboxes.forEach((checkbox) => {
                   values.push(checkbox.value);
               });


               let reprint = data.filter(element => {
                    return values.includes(element.country) 
                 
               });

     
               draw(reprint);

               values = [];
             
             });
     });     

}    


processSheets();


//BUTTONS
document.getElementById("replay").addEventListener('click', function(){
          svg.selectAll('circle').remove();
          svg.selectAll('#pathid').remove();
          svg.selectAll('rect').remove();
          clearInterval(intervalId);

          setTimeout(() => {
               year = 1960;
               draw(data); 
          }, 100);


});

document.getElementById("filter").addEventListener('click', function(){

  document.getElementById("popup").style.opacity = 1;

});


//BUTTONS END


function drawAxis(data) {



scaleX = d3.scaleLinear()
               .domain([0, 100])
               .nice()
               .range([dim.margin, dim.width-dim.margin]);
     
let axisX = d3.axisBottom(scaleX);

svg.append('g')
     .attr('transform', `translate(0, ${dim.height-dim.margin})`) 
     .call(axisX);   

scaleY = d3.scaleLinear()
     .domain([0, 12])
     .nice()
     .range([dim.height-dim.margin, dim.margin]);


let axisY = d3.axisLeft(scaleY);



svg.append('g')
     .attr('transform', `translate(${dim.margin}, 0)`)
     .call(axisY);  
     

colorCountry = d3.scaleOrdinal()
                    .domain(data, d => d.country)             
                    .range(d3.schemeSet3);

radiusCountry = d3.scaleLinear()
                   .domain([50000, 1500000000])
                   .range([7,40]);
                   
                   
//also populate the  curveCountry array;

data.forEach(item => {
     curveCountry.push([])
});

}




function draw(data) {  

          function update(year) {
          
               let circles = g.selectAll('circle')
               .data(data, d=> d.country)
               .join(enter =>
               enter.append('circle')
               .attr('cx', (d) =>{
                    return  isNaN(d.life[year]) ? scaleX(50) : scaleX(d.life[year])
               })           
               .attr('cy', function(d){
                    return  isNaN(d.fertility[year]) ? scaleY(5) : scaleY(d.fertility[year])     
               }) 
               .attr('r', (d)=>{
                         return radiusCountry(d.population[year]);
               })
               .attr('z-index', 10)
               .attr('fill', function(d){

                         colorMap.set(d.country, colorCountry(d.country));
                    return colorCountry(d.country);
               }),
               update => update
                         .call(circle => circle.transition().ease(d3.easeLinear,1).duration(700)            
                         .attr('cx', (d) =>{
                         return  isNaN(d.life[year]) ? scaleX(50) : scaleX(d.life[year])
                         })           
                         .attr('cy', function(d){
                         return  isNaN(d.fertility[year]) ? scaleY(5) : scaleY(d.fertility[year])     
                         }))
                         .attr('r', (d) =>{
                              return radiusCountry(d.population[year]);
                         }),
               exit => exit
                    .call(circle => circle.transition().ease(d3.easeLinear,1).duration(700)            
                    .attr('cx', (d) =>{
                    return  isNaN(d.life[year]) ? scaleX(50) : scaleX(d.life[year])
                    })           
                    .attr('cy', function(d){
                    return  isNaN(d.fertility[year]) ? scaleY(5) : scaleY(d.fertility[year])     
                    }))
                    .attr('r', (d) =>{
                         return radiusCountry(d.population[year]);
                    })       
               )
               .call(circle => circle.transition().ease(d3.easeLinear,1).duration(700)            
                    .attr('cx', (d) =>{
                    return  isNaN(d.life[year]) ? scaleX(50) : scaleX(d.life[year])
                    })           
                    .attr('cy', function(d){
                    return  isNaN(d.fertility[year]) ? scaleY(5) : scaleY(d.fertility[year])     
                    }))
                    .on("mouseover", function(d){
                         div.transition()
                              .duration(500)
                              .style("opacity", .9);
                         div.html(d.country)
                         .style("left", d3.event.pageX + "px")
                         .style("top", d3.event.pageY + "px") 
                         })
                    .on("mouseout", function(d){
                              div.transition()
                              .duration(500)
                              .style("opacity", 0);
                         })
                    .on("click", function(d){

                         let country = data.filter(element => {
                              return element.country==d.country
                         });

                         drawPaths(country);
                         counter++;
               
                    });
               
               svg.selectAll('#txtid').remove();

               svg
               .append('text')
               .attrs(textAttributes)
               .text(year);
                              

          }

          year = 1960;
          intervalId = setInterval(function(d){
               if(year >=2013){
                    clearInterval(intervalId);
               }
               update(year.toString());

               year++;
          
          }, 200);

}



function drawPaths(subsetdata){    

   
     var line = d3.line()
          .x(d => isNaN(d[0])? scaleX(50): scaleX(d[0]))
           .y(d => isNaN(d[1])? scaleY(5): scaleY(d[1]))
          .curve(d3.curveBasis);
     let yearCounterFirst = 1960;
     let yearCounterSecond = 1960;

     let slicecounter = 1;
      
     for(let i = 1960 ; i < 2014; i++){

          curveCountry[counter].push([subsetdata[0].life[i.toString()], subsetdata[0].fertility[i.toString()], subsetdata[0].country, i])
          yearCounterFirst++;
     }     

     
     let temp = curveCountry[counter];
    
     let intervalIdCountry = setInterval(function(d){
          if(yearCounterSecond >=2013){
               clearInterval(intervalIdCountry)
          }
         
          update(temp.slice(0, slicecounter))   
          updateAnnotation(temp.slice(0, slicecounter))   
     

          slicecounter +=1;
          yearCounterSecond++;
         
     }, 10);




     function update(data) {
          
               g.selectAll('path')
               .data(data, d=> d)
               .join(enter =>
                    enter.append('path')
                    .attr('fill', 'none')
                    .attr('stroke', function(d){
                         return colorMap.get(d[2]);
                    })
                    .attr('stroke-width', '5px')
                    .attr('id', 'pathid')
                    .attr('z-index', -1)
                    .attr('d', line(data)),
                    update => update
                         .call(path => path.transition().ease(d3.easeLinear,1).duration(100)            
                         .attr('d', line(data))),
                    exit => exit
                         
                    
               ).call(path => path.transition().ease(d3.easeLinear,1).duration(100)            
                    .attr('d', line(data)
                    ))
     }


     function updateAnnotation(data) {
          
               g.selectAll('rect')
               .data(data, d=> d)
               .join(enter =>
                    enter.append('rect')
                    .attr('x', (d) =>{
                         return  isNaN(d[0]) ? scaleX(0) : scaleX(d[0])
                    })           
                    .attr('y', function(d){
                         return  isNaN(d[1]) ? scaleY(0) : scaleY(d[1])     
                    }) 
                    .attr('width', (d)=>{
                         return 10;
                    })
                    .attr('height', (d) =>{
                         return 20;
                    })
                    .attr('fill', function(d){
                         return 'transparent';
                    }),
                    update => update,
                    exit => exit
                         
                    
               )
               .call(rect => rect.transition().ease(d3.easeLinear,1).duration(700)            
               .attr('x', (d) =>{
               return  isNaN(d[0]) ? scaleX(0) : scaleX(d[0])
               })           
               .attr('y', function(d){
               return  isNaN(d[1]) ? scaleY(0) : scaleY(d[1])     
               }))
               .on("mouseover", function(d){
                    div.transition()
                         .duration(500)
                         .style("opacity", .9);

                    if(d[3]==2013) {
                         div.html(d[2])
                         .style("left", d3.event.pageX + "px")
                         .style("top", d3.event.pageY + "px") 
                    }else{
                    div.html(d[3])
                         .style("left", d3.event.pageX + "px")
                         .style("top", d3.event.pageY + "px") 
                         }   
                    })
               .on("mouseout", function(d){
                         div.transition()
                         .duration(500)
                         .style("opacity", 0);
                    })
               .on("click", function(d){

                    
               
               });
     }
     
 
}
