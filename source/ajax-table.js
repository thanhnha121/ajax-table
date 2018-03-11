$(document).ready(function () {
  AT_Init($('#at-place-here'),
    {
      columns : [
        { title: 'Name',     property: 'name',     sortable: true },
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
        sortPath        : 'sort',

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
      },
      // callback on complete
      complete: function() {
        console.log('#at-place-here DONE!');
      }
    });

  AT_Init($('#at-place-here2'),
    {
      columns : [
        { title: 'Name',     property: 'name',     sortable: true },
        { title: 'Address',  property: 'address',  sortable: false },
        { title: 'Email',    property: 'email',    sortable: false },
        { title: 'Phone',    property: 'phone',    sortable: false }
      ],
      // show index column
      index   : false,
      api     : {
        // config path data params
        // input
        pageIndexPath   : 'pageIndex',
        searchInputPath : 'searchInput',
        viewCountPath   : 'viewCount',
        sortPath        : 'sort',

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

function AT_Init(selector, config) {
  selector.append(
    `
      <div class="at-wrapper">

        <div class="at-header">
          <div class="at-view-count">
            Show: <input placeholder="Interger" id="at-view-count" 
              value="10" 
              type="text" 
              onkeypress="return event.charCode >= 48 && event.charCode <= 57" /> results / 1 page
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

  selector.click(function AT_SelectorClick(e) {
    AT_CurrentSelector = selector;
    AT_Config = config;
  });

  AT_RenderHeader(selector, config);

  AT_GoToPage(1, selector, config);

  AT_HandleShowCountEnter(selector);
  AT_HandleSearchInput(selector);

}

function AT_RenderHeader(selector, config) {
  var headerHtml = '';

  if (config.index) {
    headerHtml = '<div>Index</div>';
  }

  var id = selector.attr('id') ? selector.attr('id') : '';

  for (var i = 0; i <= config.columns.length - 1; i++) {
    if (config.columns[i].sortable) {
      headerHtml += '<div class="at-sortable" onclick="AT_SortCLick(\'' + id + '\', \'' 
        + config.columns[i].property + '\')">' 
        + config.columns[i].title + '<img src=\'assets/sort.svg\'></div>';
    } else {
      headerHtml += '<div>' + config.columns[i].title + '</div>';
    }
  }

  selector.find('.at-body > .at-body-header').html(headerHtml);
}

function AT_SortCLick(id, property) {
  var oldSort = $('#' + id).attr('data-at-sort', property);
  if (oldSort !== undefined && oldSort !== null && oldSort !== '') {
    if () {
      
    }
  } else {

  }
}

function AT_HandleShowCountEnter(selector) {
  selector.find('#at-view-count').keyup(function HandleShowCountEnter(e) {
    if (e.which === 13) {
      selector.attr('data-at-is-changed-show-count', 'true');
      selector.attr('data-at-current-show-count', selector.find('#at-view-count').val().trim());
      AT_GoToPage(1);
    }    
  });
}

function AT_HandleSearchInput(selector) {
  selector.find('#at-search-input').keyup(function HandleShowCountEnter(e) {
    if (e.which === 13) {
      selector.attr('data-at-is-searching', 'true');
      selector.attr('data-at-current-search-input', selector.find('#at-search-input').val().trim());
      AT_GoToPage(1);
    }    
  });
}

function AT_GoToPage(page, selector, config) {
  setTimeout(() => {
    config = config ? config : AT_Config;
    selector = selector ? selector : AT_CurrentSelector;

    AT_ShowLoading(selector);

    var data = config.api.data;

    data[config.api.pageIndexPath]   = page;
    if (selector.attr('data-at-is-changed-show-count') === 'true') {
      data[config.api.viewCountPath] = selector.attr('data-at-current-show-count');
    } else {
      data[config.api.viewCountPath] = 10;
    }

    data[config.api.pageIndexPath]   = page;
    if (selector.attr('data-at-is-searching') === 'true') {
      data[config.api.searchInputPath] = selector.attr('data-at-current-search-input');
    } else {
      data[config.api.searchInputPath] = '';
    }

    $.ajax({
      url     : config.api.url,
      type    : config.api.method,
      dataType: config.api.dataType,
      data    : config.api.dataType === 'GET' ? {} : data,
      headers : config.api.headers,
      success : (response) => {
        if (response[config.api.statusPath]) {

          AT_RenderTableBody(response, page, selector, config);
          AT_RenderFooter(response, page, selector, config);
          setTimeout(() => {
            AT_HideLoading(selector);
          }, 100);

        } else {
          setTimeout(() => {
            AT_HideLoading(selector);
          }, 100);
          console.log('[Ajax Table] Call api error: ', response);
        }
      },
      error   : (error) => {
        setTimeout(() => {
          AT_HideLoading(selector);
        }, 100);
        console.log('[Ajax Table] Call api error: ', response);
      }
    });
  }, 1);

}

function AT_RenderTableBody(response, page, selector, config) {
  var bodyHtml = '';
  var viewCount = $('#at-view-count').val().trim();

  for (var i = 0; i <= response[config.api.dataPath].length - 1; i++) {
    var tdHtml = '<div class="at-row">';
    if (config.index) {
      tdHtml += '<div>' + (((page - 1) * viewCount) + i + 1) + '</div>';
    }
    for (var j = 0; j <= config.columns.length - 1; j++) {
      tdHtml += '<div>' + response[config.api.dataPath][i][config.columns[j].property] + '</div>';
    }
    tdHtml += '</div>';

    bodyHtml += tdHtml;
  }

  selector.find('.at-body > .at-body-rows').html(bodyHtml);
}

function AT_RenderFooter(response, page, selector, config) {
  var viewCount = $('#at-view-count').val().trim();
  var footerLeftHtml = '<div>Showing from </div>';

  var fromCount = response[config.api.dataPath].length > 0 
    ? ((page - 1) * viewCount + 1) : 0;

  var toCount = (page * viewCount) < response[config.api.countPath] 
    ? (page * viewCount) : response[config.api.countPath];

  footerLeftHtml += '<div class="at-params">' + fromCount + '</div>';
  footerLeftHtml += '<div> to </div>';
  footerLeftHtml += '<div class="at-params">' + toCount + '</div>';
  footerLeftHtml += '<div> in total </div>';
  footerLeftHtml += '<div class="at-params">' + (response[config.api.countPath]) + '</div>';
  footerLeftHtml += '<div> results.</div>';

  selector.find('.at-footer > .at-footer-left').html(footerLeftHtml);

  var pageCount = 1;
  if (response[config.api.countPath] % viewCount === 0) {
    pageCount = Math.floor(response[config.api.countPath] / viewCount);
   } else {
    pageCount = Math.floor(response[config.api.countPath] / viewCount) + 1;
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

  selector.find('.at-footer > .at-footer-right > .at-paging-wrapper').html(footerRightHtml);

  if (page === 1) {
    selector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-first').hide();
    selector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-pre').hide();
  }
  if (page < 2) {
    selector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-curr-pre-1').hide();
  }
  if (page < 3) {
    selector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-curr-pre-2').hide();
  }
  if (page === pageCount || pageCount === 0) {
    selector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-last').hide();
    selector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-next').hide();
  }
  if (page > pageCount - 1) {
    selector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-curr-next-1').hide();
  }
  if (page > pageCount - 2) {
    selector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-curr-next-2').hide();
  }

  if (response[config.api.countPath] < 1) {
    selector.find('.at-footer > .at-footer-right > .at-paging-wrapper .at-current-page').hide();
  }

  if (config.complete) {
    config.complete();
  }

}

function AT_ShowLoading(selector) {
  selector.find('.at-loading').removeClass('at-display-block');
  selector.find('.at-loading').addClass('at-display-block');
}

function AT_HideLoading(selector) {
  selector.find('.at-loading').removeClass('at-display-block');
}