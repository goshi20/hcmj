function createGraph (data,id){
  const margin = {top: 20, right: 20, bottom: 30, left: 100};
  const width = 450 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  // グラフのベース作成
  var svg = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");


  // X軸とY軸の設定
  var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1)
            .domain(data.map(function(d) { return d.name; })); //メモリ設定

  var x = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(data, function(d){ return d.value; })]);//メモリ設定

  // グラフ描画
  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("width", function(d) {return x(d.value); } )
      .attr("y", function(d) { return y(d.name); })
      .attr("height", y.bandwidth());

  //X軸描画
  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  //Y軸描画
  svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

  //会社名と名前で改行処理
  if(id == mrVisitRankingId){
    svg.selectAll("g.y-axis text")
        .each(function (name) {
            var textElement = d3.select(this);
            // データを特定
            var target = $.grep(data, function(elem,idx){
              return (elem.name == name)
            });

            // 元のテキストを削除して
            textElement.text("");
            // 一行目のデータを追加して
            textElement.append("tspan")
                .attr("x", -10)
                .attr("dy", 0)
                .text(target[0].company);
            // 二行目のデータを追加する。位置は微調整が必要
            textElement.append("tspan")
                .attr("x", -10)
                .attr("dy", 10)
                .text(name);
        });

  }

}

//valueの降順になるようにソート
function compare(a,b){
  var r = 0;
  if( a.value < b.value ){
    r = -1;
  }else if( a.value > b.value ){
    r = 1;
  }
  return r;
}


var mrVisitRankingId = "#mr_visit_ranking_graph";
var stayTimeId = "#stay_time_graph";

//チェックイン回数
if($(mrVisitRankingId).length > 0){
  var url = "assets/js/sample1.json";
  $.getJSON(url,function (data){
    data.sort(compare);
    createGraph(data,mrVisitRankingId);
  })
}

//滞在時間
if($(stayTimeId).length > 0){
  var url = "assets/js/sample2.json";
  $.getJSON(url,function (data){
    data.sort(compare);
    createGraph(data,stayTimeId);
  })
}
