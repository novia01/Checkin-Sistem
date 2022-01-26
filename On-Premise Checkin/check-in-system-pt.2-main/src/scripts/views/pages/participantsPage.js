const participantPage = {
  async render() {
    return `
        <section class="mx-auto pb-40">
          <div class="flex items-center justify-between pt-2">
            <button>
              <a href="/#/">
                <span class="iconify text-4xl" data-icon="bi:arrow-left-short"></span>
              </a>
            </button>
            <h1 class="text-center font-bold text-base">List Participants</h1>
            <div></div>
          </div>

          <!-- Status Check in -->
          <div id="checkInStatus" class="mx-auto my-8 flex items-center justify-center font-semibold">

          </div>

          <!--TABLE-->
          <table id="table-id" class="sortable mx-auto text-base table-fix w-full pt-2 px-2">
          <div id="userstable_filter" class="dataTables_length"></div>
              <thead class="sticky -top-0.5">
              <tr>
                  <th class="bg-white">Nama</th>
                  <th class="bg-white">ID</th>
                  <th class="bg-white">Session</th>
                  <th class="bg-white">Action</th>
              </tr>
              </thead>
              <tbody id="customer" class="text-center text-sm"></tbody>
          </table>
        </section>
    `;
  },

  async afterRender() {

  
  $(document).ready(function() {
    var table = $('#table-id').DataTable( {
        "ajax": "https://checkin.nvia.xyz/items/registration?fields=session_id,customer_id.id,customer_id.name",
        "bInfo" : true,
        "columns": [
          { data: "customer_id.name"},
          { data: "customer_id.id"},
          { data: "session_id"}, 
          { data: null }
        ],
        "scrollY":"473px",
        "scrollCollapse": true,
        "pagingType":"simple_numbers",
        language: {
          sLengthMenu:"_MENU_",
          search: '', searchPlaceholder: "Participant ID / Nama" ,
          oPaginate: {
              sNext: ' <button class="px-4 py-2 my-1 text-white bg-blue-500 rounded-full hover:bg-gray-700 hover:text-black" > > <button class="sr-only ">(current)</button>',
              sPrevious: ' <button class="px-4 py-2 my-1 text-white bg-blue-500 rounded-full hover:bg-gray-700 hover:text-black" > < <button class="sr-only ">(current)</button>',
        }
      },

      "columnDefs": [{
      "targets": -1,
      "data": null,
      "render": function(data, type, row, meta) {
          return `<a href="/#/participant/${data.customer_id.id}-${data.session_id}"><button class='bg-blue-500 hover:bg-gray-700 text-white font-bold px-2 md:py-2 md:px-4 rounded-full m-1'>Detail</button></a>`
      }
      }],
    initComplete: function () {
      this.api().columns([2]).every( function () {
            var column = this;
            var select = $('<select><option value=""></option></select>')
                .appendTo( $('#userstable_filter') )
                .on( 'change', function () {
                    var vals = $('option:selected', this).map(function (index, element) {
                      return $.fn.dataTable.util.escapeRegex($(element).val());
                    }).toArray().join('|');

                    column
                        .search( vals.length > 0 ? '^('+vals+')$' : '', true, false )
                        .draw();
                } );

            column.data().unique().sort().each( function ( d, j ) {
                if(column.search() === '^'+d+'$'){
                  select.append( '<option value="'+d+'">'+d+'</option>' )
              } else {
                select.append( '<option value="'+d+'">'+d+'</option>' )
              }
            } );
        } );
    }
    });

    $('#table-id tbody').on( 'click', 'button', function () {
      const data = table.row( $(this).parents('tr') ).data();
    });
  });
  }
};

export default participantPage;