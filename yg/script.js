// 颜色数组
const colors = ["#ff6384", "#36a2eb"];

// 创建饼图生成器
const pie = d3.pie()
  .value(d => d.count)
  .sort(null);

// 创建弧生成器
const arc = d3.arc()
  .innerRadius(0)
  .outerRadius(250);

// 选择 SVG 元素
const svg = d3.select("#chart")
  .attr("width", 800)
  .attr("height", 800);

// 数据集1：订阅用户和游客用户
const dataset1 = [
  { label: "订阅用户", count: 1819655 },
  { label: "游客用户", count: 462444 }
];

// 数据集2：男女比例
const dataset2 = [
  { label: "男", count: 1141059 },
  { label: "女", count: 366672 }
];

// 全局变量data
let data = dataset1;

// 绘制初始的饼图
drawPie();

// 绘制饼图函数
function drawPie() {
  // 移除现有的饼图
  svg.selectAll(".arc").remove();

  // 创建弧组元素
  const arcs = svg.selectAll("g.arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", "translate(300, 300)");

  // 添加路径元素
  const paths = arcs.append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => colors[i])
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .on("click", handleClick);

  // 添加注释文本
  arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("fill", "#fff")
    .text(d => `${d.data.label} (${getPercentage(d)})`);

  // 获取百分比的函数
  function getPercentage(d) {
    const total = d3.sum(data, d => d.count);
    return ((d.data.count / total) * 100).toFixed(1) + "%";
  }

  // 鼠标悬停事件处理函数
  function handleMouseOver(event, d) {
    d3.select(this)
      .transition()
      .duration(200)
      .attr("d", d3.arc().innerRadius(0).outerRadius(270));

    svg.append("text")
      .attr("class", "tooltip")
      .attr("x", 250)
      .attr("y", 250)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "#fff")
      .text(`${d.data.count} (${getPercentage(d)})`);
  }

  // 鼠标移出事件处理函数
  function handleMouseOut(event, d) {
    d3.select(this)
      .transition()
      .duration(200)
      .attr("d", arc);

    svg.select(".tooltip").remove();
  }

  // 鼠标点击事件处理函数
  function handleClick(event, d) {
    if (d.data.label === "订阅用户") {
      // 为被点击的路径元素添加 clicked 类名
      d3.select(this).classed("clicked", true);

      // 更新全局变量data为数据集2
      data = dataset2;

      // 绘制新的饼图
      drawPie();
    }
  }
}
