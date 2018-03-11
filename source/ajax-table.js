$(document).ready(function () {
  AT_Init($('#at-place-here'),
    {
      columns : [
        { title: 'Name',     property: 'name',     sortable: false },
        { title: 'Address',  property: 'address',  sortable: false },
        { title: 'Email',    property: 'email',    sortable: false },
        { title: 'Phone',    property: 'phone',    sortable: false }
      ],
      // show index column
      index   : true,
      api     : {
        // config path data params
        // input
        pageIndexPath   : 'pageIndex',
        searchInputPath : 'searchInput',
        viewCountPath   : 'viewCount',

        // output
        dataPath        : 'data',                     // data | data.list....
        countPath       : 'count',                    // count | total | ...
        statusPath      : 'status',                   // count | total | ...

        // config ajax call
        method          : 'POST',
        dataType        : 'JSON',
        headers         : {},
        data            : {},
        url             : 'http://localhost:3100/api/test/example_data'
      }
    });

});

var AT_Config;
var AT_CurrentSelector;
var AT_IsSearching;
var AT_CurrentSearchInput;
var AT_IsChangedShowCount;
var AT_CurrentShowCount;

function AT_Init(selector, config) {
  AT_CurrentSelector = selector;
  AT_Config = config;
  AT_CurrentSelector.append(
    `
      <div class="at-wrapper">

        <div class="at-header">
          <div class="at-view-count">
            Show: <input placeholder="Interger" id="at-view-count" value="10"  type="text" onkeypress="return event.charCode >= 48 && event.charCode <= 57" /> results / 1 page
          </div>

          <div class="at-search">
            Search: <input id="at-search-input" placeholder="keyword..." />
            <img src="assets/icon-search.svg" />
          </div>
        </div>

        <div class="at-body">

          <div class="at-body-header"></div>
          <div class="at-body-rows"></div>

        </div>

        <div class="at-footer">
          <div class="at-footer-left"></div>
          
          <div class="at-footer-right"><div class="at-paging-wrapper"></div></div>
          
        </div>

        <div class="at-loading">
          <img src="assets/loading.gif" />  
        </div>

      </div>
    `
  );

  AT_RenderHeader();

  AT_GoToPage(1);

  AT_HandleShowCountEnter();
  AT_HandleSearchInput();

}

function AT_HandleShowCountEnter() {
  AT_CurrentSelector.find('#at-view-count').keyup(function HandleShowCountEnter(e) {
    if (e.which === 13) {
      AT_IsChangedShowCount = true;
      AT_CurrentShowCount = $('#at-view-count').val().trim();
      AT_GoToPage(1);
    }    
  });
}

function AT_HandleSearchInput() {
  AT_CurrentSelector.find('#at-search-input').keyup(function HandleShowCountEnter(e) {
    if (e.which === 13) {
      AT_IsSearching = true;
      AT_CurrentSearchInput = $('#at-search-input').val().trim();
      AT_GoToPage(1);
    }    
  });
}

function AT_RenderHeader() {
  var headerHtml;

  if (AT_Config.index) {
    headerHtml = '<div>Index</div>';
  }

  for (var i = 0; i <= AT_Config.columns.length - 1; i++) {
    headerHtml += '<div>' + AT_Config.columns[i].title + '</div>';
  }

  AT_CurrentSelector.find('.at-body > .at-body-header').html(headerHtml);
}

function AT_GoToPage(page) {
  AT_ToggleShowLoading();

  var data = AT_Config.api.data;

  data[AT_Config.api.pageIndexPath]   = page;
  if (AT_IsChangedShowCount) {
    data[AT_Config.api.viewCountPath] = AT_CurrentShowCount;
  } else {
    data[AT_Config.api.viewCountPath] = 10;
  }

  data[AT_Config.api.pageIndexPath]   = page;
  if (AT_IsSearching) {
    data[AT_Config.api.searchInputPath] = AT_CurrentSearchInput;
  } else {
    data[AT_Config.api.searchInputPath] = '';
  }

  $.ajax({
    url     : AT_Config.api.url,
    type    : AT_Config.api.method,
    dataType: AT_Config.api.dataType,
    data    : AT_Config.api.dataType === 'GET' ? {} : data,
    headers : AT_Config.api.headers,
    success : (response) => {
      if (response[AT_Config.api.statusPath]) {

        AT_RenderTableBody(response, page);
        AT_RenderFooter(response, page);
        setTimeout(() => {
          AT_ToggleShowLoading();
        }, 100);
      } else {
        setTimeout(() => {
          AT_ToggleShowLoading();
        }, 100);
        console.log('[Ajax Table] Call api error: ', response);
      }
    },
    error   : (error) => {
      setTimeout(() => {
        AT_ToggleShowLoading();
      }, 100);
      console.log('[Ajax Table] Call api error: ', response);
    }
  });

}

function AT_RenderTableBody(response, page) {
  var bodyHtml = '';
  var viewCount = $('#at-view-count').val().trim();

  for (var i = 0; i <= response[AT_Config.api.dataPath].length - 1; i++) {
    var tdHtml = '<div class="at-row">';
    if (AT_Config.index) {
      tdHtml += '<div>' + (((page - 1) * viewCount) + i + 1) + '</div>';
    }
    for (var j = 0; j <= AT_Config.columns.length - 1; j++) {
      tdHtml += '<div>' + response[AT_Config.api.dataPath][i][AT_Config.columns[j].property] + '</div>';
    }
    tdHtml += '</div>';

    bodyHtml += tdHtml;
  }

  AT_CurrentSelector.find('.at-body > .at-body-rows').html(bodyHtml);
}

function AT_RenderFooter(response, page) {
  var viewCount = $('#at-view-count').val().trim();
  var footerLeftHtml = '<div>Showing from </div>';

  var fromCount = response[AT_Config.api.dataPath].length > 0 
    ? ((page - 1) * viewCount + 1) : 0;

  var toCount = (page * viewCount) < response[AT_Config.api.countPath] 
    ? (page * viewCount) : response[AT_Config.api.countPath];

  footerLeftHtml += '<div class="at-params">' + fromCount + '</div>';
  footerLeftHtml += '<div> to </div>';
  footerLeftHtml += '<div class="at-params">' + toCount + '</div>';
  footerLeftHtml += '<div> in total </div>';
  footerLeftHtml += '<div class="at-params">' + (response[AT_Config.api.countPath]) + '</div>';
  footerLeftHtml += '<div> results.</div>';

  AT_CurrentSelector.find('.at-footer > .at-footer-left').html(footerLeftHtml);

  var pageCount = 1;
  if (response[AT_Config.api.countPath] % viewCount === 0) {
    pageCount = Math.floor(response[AT_Config.api.countPath] / viewCount);
   } else {
    pageCount = Math.floor(response[AT_Config.api.countPath] / viewCount) + 1;
  }

  var footerRightHtml = 
    `
      <div class="at-page at-first" onclick="AT_GoToPage(1)">First</div>
      <div class="at-page at-pre" onclick="AT_GoToPage(` + (page - 1) + `)"><</div>

      <div class="at-page at-curr-pre-2" onclick="AT_GoToPage(` + (page - 2) + `)">` + (page - 2) + `</div>
      <div class="at-page at-curr-pre-1" onclick="AT_GoToPage(` + (page - 1) + `)">` + (page - 1) + `</div>

      <div class="at-page at-current-page">` + page + `</div>

      <div class="at-page at-curr-next-1" onclick="AT_GoToPage(` + (page + 1) + `)">` + (page + 1) + `</div>
      <div class="at-page at-curr-next-2" onclick="AT_GoToPage(` + (page + 2) + `)">` + (page + 2) + `</div>

      <div class="at-page at-next" onclick="AT_GoToPage(` + (page + 1) + `)">></div>
      <div class="at-page at-last" onclick="AT_GoToPage(` + pageCount + `)">Last</div>
    `
  ;

  AT_CurrentSelector.find('.at-footer > .at-footer-right > .at-paging-wrapper').html(footerRightHtml);

  if (page === 1) {
    AT_CurrentSelector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-first').hide();
    AT_CurrentSelector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-pre').hide();
  }
  if (page < 2) {
    AT_CurrentSelector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-curr-pre-1').hide();
  }
  if (page < 3) {
    AT_CurrentSelector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-curr-pre-2').hide();
  }
  if (page === pageCount || pageCount === 0) {
    AT_CurrentSelector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-last').hide();
    AT_CurrentSelector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-next').hide();
  }
  if (page > pageCount - 1) {
    AT_CurrentSelector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-curr-next-1').hide();
  }
  if (page > pageCount - 2) {
    AT_CurrentSelector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-curr-next-2').hide();
  }

  if (response[AT_Config.api.countPath] < 1) {
    AT_CurrentSelector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-current-page').hide();
  }

}

function AT_ToggleShowLoading() {
  AT_CurrentSelector.find('.at-loading').toggle();
}