$(document).ready(function () {
  AT_Init($('#at-place-here'),
    {
      columns: [
        { header: 'Name', property: 'name', sortable: false, },
        { header: 'Address', property: 'address', sortable: false, },
        { header: 'Email', property: 'email', sortable: false, },
        { header: 'Phone', property: 'phone', sortable: false, },
      ],
      dataPath: 'data',     // data | data.list....
      countPath: 'count',   // count | total | ...
      viewCount: 10,
      index: true,
      api: {
        method: 'GET',
        options: {},
        header: {},
        data: {},
        url: ''
      }
    });
});

// save config
var AT_Config;

function AT_Init(selector, config) {
  selector.append(
    `
      <div class="at-wrapper">

        <div class="at-header">
          <div class="at-view-count">
            Show: <input placeholder="Interger" value="10"  type="text" onkeypress="return event.charCode >= 48 && event.charCode <= 57" /> results / 1 page
          </div>

          <div class="at-search">
            Search: <input placeholder="keyword..." />
            <img src="assets/icon-search.svg" />
          </div>
        </div>

        <div class="at-body">

          <div class="at-body-header">
            <div>Index</div>
            <div>Name</div>
            <div>Address</div>
            <div>Email</div>
            <div>Phone</div>
          </div>

          <div class="at-body-rows">
            <div class="at-row">
              <div>1</div>
              <div>Nha Hoang</div>
              <div>Nam Dinh</div>
              <div>nhaht@gmail.com</div>
              <div>01676053684</div>
            </div>
          </div>

        </div>

        <div class="at-footer">
          <div class="at-footer-left">
            <div>Showing from </div>
            <div class="at-params">0</div>
            <div> to </div>
            <div class="at-params">10</div>
            <div> in total </div>
            <div class="at-params">100</div>
            <div> results.</div>
          </div>
          
          <div class="at-footer-right">
            <div class="at-paging-wrapper">
              <div class="at-page at-first">First</div>
              <div class="at-page at-pre"><</div>
              <div class="at-page">1</div>
              <div class="at-page">2</div>
              <div class="at-page">...</div>
              <div class="at-page">4</div>
              <div class="at-page">5</div>
              <div class="at-page at-next">></div>
              <div class="at-page at-last">Last</div>
            </div>
          </div>
          
        </div>

        <div class="at-loading">
          <img src="assets/loading.gif" />  
        </div>

      </div>
    `
  );
}

function AT_BeforeInit(selector, config) {

}