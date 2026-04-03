const ctx=document.getElementById('grafico');
new Chart(ctx,{type:'bar',data:{labels:['Seg','Ter'],datasets:[{data:[10,20]}]}});