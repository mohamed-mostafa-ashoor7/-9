let data = JSON.parse(localStorage.getItem('mosqueNoor')) || [];
const tbody = document.getElementById('tbody');
const table = document.getElementById('table');

function saveData(){
  const date = document.getElementById('date').value.trim();
  const amountVal = document.getElementById('amount').value.trim();
  const amount = parseFloat(amountVal);
  const type = document.getElementById('type').value;
  const note = document.getElementById('note').value.trim();

  if(!date){ alert('اكتب التاريخ'); return; }
  if(!amountVal || isNaN(amount)){ alert('اكتب المبلغ'); return; }

  data.push({ id: Date.now(), date, amount, type, note });
  localStorage.setItem('mosqueNoor', JSON.stringify(data));

  document.getElementById('date').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('note').value = '';
  render();
}

function render(){
  tbody.innerHTML = '';
  let total = 0;
  data.forEach(i => {
    if(i.type === 'دخل') total += i.amount; else total -= i.amount;
    tbody.innerHTML += `<tr><td>${i.date}</td><td style="color:${i.type==='دخل'?'green':'red'};font-weight:bold">${i.amount}</td><td>${i.type}</td><td>${i.note}</td><td><button class="del" data-id="${i.id}">حذف</button></td></tr>`;
  });
  document.getElementById('total').innerText = total;
}

tbody.addEventListener('click', e => {
  if(e.target.classList.contains('del')){
    if(!confirm('تمسح؟')) return;
    data = data.filter(x => x.id!== Number(e.target.dataset.id));
    localStorage.setItem('mosqueNoor', JSON.stringify(data));
    render();
  }
});

function toggleTable(){
  table.style.display = table.style.display === 'none' || table.style.display === ''? 'table' : 'none';
}
function exportData(){
  if(!data.length){ alert('مفيش بيانات'); return; }
  const blob = new Blob([JSON.stringify(data)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'mosque_noor_backup.json';
  a.click();
}
function importData(e){
  const file = e.target.files[0]; if(!file) return;
  const r = new FileReader();
  r.onload = ev => {
    data = JSON.parse(ev.target.result);
    localStorage.setItem('mosqueNoor', JSON.stringify(data));
    render();
    alert('تم الاسترجاع');
  };
  r.readAsText(file);
}
function makeQR(){
  const div = document.getElementById('qrcode');
  div.innerHTML = ''; div.style.display = 'block';
  new QRCode(div, { text: window.location.href, width: 180, height: 180 });
}
function clearQR(){
  const d = document.getElementById('qrcode');
  d.style.display = 'none'; d.innerHTML = '';
}

render();