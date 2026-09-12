const state = { data: null };

const loadData = async () => {
  $('#status').text('加载中...').show();
  try {
    const response = await fetch('data/climate.json');
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    const data = await response.json();
    if (data.series.length === 0) {
      $('#status').text('暂无数据').show();
      return;
    }
    state.data = data;
    $('#sub-title').text(data.title + ' · 数据来源：' + data.source);
    $('#status').hide();
    renderCards(data);
  } catch (error) {
    $('#status').text('加载失败：' + error.message).show();
  }
};

const getSeriesKey = (s) => Object.keys(s).find(k => k !== 'counts');

const renderCards = (data) => {
  data.series.forEach(s => {
    const key = getSeriesKey(s);
    const label = s[key];
    let value, unit, desc;
    if (key === 'temp-high') {
      value = Math.max(...s.counts);
      unit = '℃';
      desc = '本周最高气温';
    } else if (key === 'temp-low') {
      value = Math.min(...s.counts);
      unit = '℃';
      desc = '本周最低气温';
    } else {
      value = s.counts.reduce((sum, n) => sum + n, 0);
      unit = 'mm';
      desc = `共${data.days.length}天累计`;
    }
    $('#cards').append(`
      <div class="col-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title h6">${label}</h3>
            <p class="card-text fs-4">${value}<span class="fs-6 text-muted"> ${unit}</span></p>
            <p class="card-text small text-muted">${desc}</p>
          </div>
        </div>
      </div>
    `);
  });
};

loadData();
