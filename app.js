(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-tab-target]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.module-panel'));
  var sidebar = document.getElementById('sidebar');
  var menuButton = document.getElementById('menuButton');
  var sourceButtons = Array.prototype.slice.call(document.querySelectorAll('[data-source]'));
  var sourceLabel = document.getElementById('sourceLabel');
  var organizeButton = document.getElementById('organizeButton');
  var ideaInput = document.getElementById('ideaInput');
  var focusTimer = document.getElementById('focusTimer');
  var startFocus = document.getElementById('startFocus');
  var resetFocus = document.getElementById('resetFocus');
  var focusSeconds = 25 * 60;
  var focusInterval = null;

  function renderFocusTimer() {
    if (!focusTimer) return;
    var minutes = Math.floor(focusSeconds / 60);
    var seconds = focusSeconds % 60;
    focusTimer.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }

  function activatePanel(id) {
    panels.forEach(function (panel) {
      panel.classList.toggle('active', panel.id === id);
    });

    tabs.forEach(function (tab) {
      tab.classList.toggle('active', tab.getAttribute('data-tab-target') === id);
    });

    if (sidebar) {
      sidebar.classList.remove('open');
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var id = tab.getAttribute('data-tab-target');
      activatePanel(id);
    });
  });

  if (menuButton && sidebar) {
    menuButton.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });
  }

  sourceButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      sourceButtons.forEach(function (item) {
        item.classList.toggle('active', item === button);
      });

      if (sourceLabel) {
        sourceLabel.textContent = button.getAttribute('data-source');
      }

      if (ideaInput && !ideaInput.value.trim()) {
        var source = button.getAttribute('data-source');
        var examples = {
          '文字输入': '例如：把五行体质做成一套女性成长社群课，并拆成公众号系列文章。',
          '语音转写': '语音转写示例：今天想到一个活动，可以让学员用五行元素分析自己的消费习惯。',
          'Get 笔记': 'Get 笔记导入示例：女性财富能量、夏季养生、社群体验课、家庭现金流。'
        };
        ideaInput.placeholder = examples[source] || examples['文字输入'];
      }
    });
  });

  if (organizeButton && ideaInput) {
    organizeButton.addEventListener('click', function () {
      var original = organizeButton.textContent;
      organizeButton.textContent = 'AI 正在分类标注...';
      organizeButton.disabled = true;

      window.setTimeout(function () {
        organizeButton.textContent = '已生成：自媒体 · 社群 · 选题 · 待行动';
        ideaInput.value = ideaInput.value || '把五行体质做成一套女性成长社群课，并拆成公众号系列文章。';

        window.setTimeout(function () {
          organizeButton.textContent = original;
          organizeButton.disabled = false;
        }, 1600);
      }, 700);
    });
  }

  if (startFocus && focusTimer) {
    startFocus.addEventListener('click', function () {
      if (focusInterval) {
        window.clearInterval(focusInterval);
        focusInterval = null;
        startFocus.textContent = '继续专注';
        return;
      }

      startFocus.textContent = '暂停';
      focusInterval = window.setInterval(function () {
        focusSeconds = Math.max(0, focusSeconds - 1);
        renderFocusTimer();

        if (focusSeconds === 0) {
          window.clearInterval(focusInterval);
          focusInterval = null;
          startFocus.textContent = '完成一轮';
        }
      }, 1000);
    });
  }

  if (resetFocus) {
    resetFocus.addEventListener('click', function () {
      if (focusInterval) {
        window.clearInterval(focusInterval);
        focusInterval = null;
      }
      focusSeconds = 25 * 60;
      renderFocusTimer();
      if (startFocus) startFocus.textContent = '开始专注';
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && sidebar) {
      sidebar.classList.remove('open');
    }
  });

  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').catch(function () {
      });
    });
  }
})();
