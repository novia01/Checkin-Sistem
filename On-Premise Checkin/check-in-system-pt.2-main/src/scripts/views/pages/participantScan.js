import UrlParser from '../../routes/urlParser';
import GetData from '../../utils/getDataApi';
import { participantName, participantId, description, registration, merchandise, buttonElement, checkStatusElement } from '../templates/participantDetail/participantTemplates';
import swal from 'sweetalert2';


const participantDetail = {
  async render() {
    return `
      <div class="spinner">
        <div class="progress-7"></div>
      </div>
      <section class="w-full mx-auto pb-40 bg-bottom ">
      <!-- Navigation -->
        <div class="flex items-center justify-between">
          <button onClick="window.history.back();" class="pl-5">
              <span class="iconify text-4xl" data-icon="bi:arrow-left-short"></span>
          </button>
          <h1 class="mx-auto font-semibold">Participant Scan</h1>
          <div></div>
        </div>
      <!-- Navigation -->
        <div class="box-border w-full bg-white mx-auto rounded-lg mt-10 mb-10 pb-5 md:px-7 px-4">
          <div class="flex items-center justify-between border-b-2 border-dashed">
            <div id="custumer">
            </div>
            <!--NOTIFY CHECKED-->
            <div id="check-status" class="rounded-lg text-center">
            </div>
          </div>
          <!--GRID-->
            <div class="grid grid-cols-2 ">
                <!--LEFT-->
                <div>
                  <!--ID-->
                 
                  <div id="participant">
                
                  </div>
                  <div id="ticket">
                     <p class="text-gray-400 py-2 font-medium text-xs">TICKET TYPE</p>
                   </div>
                  <div id="session"></div>
                </div>
                <!-- RIGHT -->
                <div>
                  <!--CHECK-IN-->
                  <div id="registration">
                  <p class="text-gray-400 pt-4 font-medium text-xs">CHECK-IN TIME</p>
                  </div>
                  <div id="session-history">
                    <p class="text-gray-400 py-2 font-medium text-xs">HISTORY SESSION</p>
                  </div>
                </div>
            </div>
          <!--GRID CLOSE-->
          <!--MERCHANDISE-->
          <form>
              <p class="text-gray-400 py-4 font-medium text-xs">MERCHANDISE</p>
              <div id="merch">
              </div>
              <!--BUTTON SUBMIT-->
              <div id="button-submit">
              </div>
          </form>
          <!--MERCHANDISE CLOSE-->
        </div>
      </section>
    `;
  },
  async afterRender() {
    checkboxItem = [];

    const { id } = UrlParser.parseActiveUrlWithoutCombiner();
    const elementName = document.querySelector('#custumer');
    const elementId = document.querySelector('#participant');
    const elementDesc = document.querySelector('#ticket');
    const validatedOn = document.querySelector('#registration');
    const merchElement = document.querySelector('#merch');
    const buttonSubmit = document.querySelector('#button-submit');
    const checkStatus = document.querySelector('#check-status');
    const spinnerElement = document.querySelector('.spinner');
    const sessionHistoryElement = document.querySelector('#session-history');

    const idParticipant = id.split('-')[0];
    const idSession = id.split('-')[1];
    let merchItem = [];

    const historySession = (data) => `
      <p class="font-bold text-xs py-2">${ data.session_id }</p>
    `;

    Promise.all([
      GetData(`https://checkin.nvia.xyz/items/registration?fields=customer_id.id,customer_id.name,ticket_type&filter[customer_id]=${idParticipant}`),
      GetData(`https://checkin.nvia.xyz/items/registration?filter[customer_id]=${idParticipant}&aggregate[min]=validated_on`),
      GetData(`https://checkin.nvia.xyz/items/customer_x_merch_eligible?fields=*,%20merch_eligible_id.merch_id.merch_name,customer_x_merch_id.id_ticket&filter[customer_x_merch_id][customer_id]=${idParticipant}`),
      GetData(`https://checkin.nvia.xyz/items/registration?filter[customer_id]=${idParticipant}&aggregate[min]=validated_on`),
      GetData(`https://checkin.nvia.xyz/items/registration?filter[customer_id]=${idParticipant}&filter[validated_on][_between]=[2020-01-1,2200-12-12]`),
    ]).then(async([res1, res2, res3, res4, res5]) => {
      res1.map((data) => {
        elementName.innerHTML = participantName(data);
        elementId.innerHTML = participantId(data);
        elementDesc.innerHTML += description(data);
      })

      res2.map((data) => {
        const valid = data.min.validated_on;
        console.log(valid)
        if(valid == null){
          validatedOn.innerHTML += `<p class="font-bold text-xs py-2">-</p>`;
        } else {
          validatedOn.innerHTML += registration(data);
        }
        
      
      });

      let firstTicket = res3[0].customer_x_merch_id.id_ticket; 
      //console.log(firstTicket);

      res3.map((data) => {
        if (firstTicket == data.customer_x_merch_id.id_ticket) {
          if(merchItem.includes(data.merch_eligible_id.merch_id.merch_name))
          merchElement.innerHTML += merchandise(data, true);
          else 
          merchElement.innerHTML += merchandise(data, false);

        }
      });

      res4.map(data => {
        //console.log(data);
        const time = data.min.validated_on;
        console.log(time)

                var status = '';
        
                const current_time = moment(new Date).format('L');
                console.log(current_time)
               
                if (time > current_time) {
                  status = 'checked';
                  checkStatus.innerHTML = checkStatusElement(status)
                  checkStatus.classList.add('bg-green-500');
                } else if (time == null){
                  status = 'inactive';
                  checkStatus.innerHTML = checkStatusElement(status)
                  checkStatus.classList.add('bg-red-600');
                } 
                else{
                  status = 'check out';
                  checkStatus.innerHTML = checkStatusElement(status)
                  checkStatus.classList.add('bg-gray-500');
                }

      });

      res5.map((data) => {
        sessionHistoryElement.innerHTML += historySession(data);
      })
      buttonSubmit.innerHTML = buttonElement;

      spinnerElement.classList.add('hidden')
    }).catch((err) => {
      console.log(err)
    });

    buttonSubmit.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      GetData(`https://checkin.nvia.xyz/items/registration?filter[customer_id]=${idParticipant}&filter[session_id]=${idSession}`).then( async (result) => {
      const id_session = result[0].id;
        
        const payload = {
          "validated_on": new Date(),
          "merch_name": checkboxItem.toString()
        }

        const response =  await fetch(`https://checkin.nvia.xyz/items/registration/${id_session}`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json"

          },
          body: JSON.stringify({payload}),
          
        })
         .then((response) => {
         
           console.log(payload)
           console.log(result)
          if (response.ok) { 
            swal.fire({
              title: "HORE!",
              text: "Data Berhasil di Update",
              icon: "success",
              confirmButtonColor: '#378805',
          }).then(function() {
            location.href = "http://localhost:8080";
          });
           return response.json();
          }
          return Promise.reject(response); 
        })
        .then((result) => { 
          console.log(result); 
        })
        .catch((error) => {
          swal.fire({
            title: "Oops...",
            text: "Data gagal di input",
            icon: "error",
            confirmButtonColor: '#D21404',
        })
          console.log(error); 
        });


      });

      


    })
  }
};

export default participantDetail;