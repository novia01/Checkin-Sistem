import GetData from '../../utils/getDataApi';

const sessionPage = {
  async render() {
    return `
      <section class="mx-auto w-full">
          <!-- navigation back -->
          <div class="flex items-center justify-between">
            <button>
              <a href="#">
                <span class="iconify text-4xl" data-icon="bi:arrow-left-short"></span>
              </a>
            </button>
            <h1 class="text-center font-bold">Event Dashboard</h1>
            <div></div>
          </div>
          <!-- navigation back -->
          <!--GRID-->
          <div id="day"class="grid grid-cols-3 text-center gap-x-2"></div>
          <div id="sessionActive"></div>
       </section>
    `;
  },
  async afterRender() {
    const dayElement = document.querySelector('#day');
    const sessionActiveElement = document.querySelector('#sessionActive');

    const day =(data) =>`
    <button class="button-day">
        <div class="relative bg-white hover:bg-yellow-100 mx-auto rounded-xl mt-10  text-gray-800 py-4 px-2 text-sm truncate">
            <p class="font-bold">${data.day_name}</p>
            <p class="truncate text-xs">${data.day_desc}</p>
            <p class="text-xs">${data.day_date}</p>
        </div>
    </button>
    `;

    const sessionActive = (data) => `
      <div class="mt-7 w-full bg-white py-3 px-4 rounded-lg shadow-lg text-center">
        <h1 class="font-bold">${data.session_type}</h1>
        <p class="truncate">${data.start_time}</p>
        <p>${data.session_desc}</p>
        <h2 class="font-bold">${data.session_speaker_name}</h2>
      </div>
    `;


    Promise.all([
      GetData('https://api-ticket.arisukarno.xyz/items/day'),
      GetData('https://checkin.nvia.xyz/items/registration?aggregate[countDistinct]=customer_id&filter[validated_on][_between]=[2020-01-1,2200-12-12]'),
    ]).then(async([res1, res2]) => {
      res1.map((data) => {
        dayElement.innerHTML += day(data)
      })

      res2.map((data) => {
        console.log(data);
      })
    }).then(() => {
      const buttonDay = document.querySelectorAll('.button-day');
      // console.log(buttonDay.length)

      buttonDay[0].addEventListener('click', () => {
        sessionActiveElement.innerHTML = '';

        GetData('https://api-ticket.arisukarno.xyz/items/session?filter[day(start_time)][_eq]=01').then((result) => {
          result.map((data) => {
            sessionActiveElement.innerHTML += sessionActive(data);
          })
        })
      });

      buttonDay[1].addEventListener('click', () => {
        sessionActiveElement.innerHTML = '';

        GetData('https://api-ticket.arisukarno.xyz/items/session?filter[day(start_time)][_eq]=03').then((result) => {
          result.map((data) => {
            sessionActiveElement.innerHTML += sessionActive(data);
          })
        })
      })

      buttonDay[2].addEventListener('click', () => {
        sessionActiveElement.innerHTML = '';

        GetData('https://api-ticket.arisukarno.xyz/items/session?filter[day(start_time)][_eq]=05').then((result) => {
          result.map((data) => {
            sessionActiveElement.innerHTML += sessionActive(data);
          })
        })
      })


    }).catch((error) => {
      console.log(error);
    })
  }
};

export default sessionPage;