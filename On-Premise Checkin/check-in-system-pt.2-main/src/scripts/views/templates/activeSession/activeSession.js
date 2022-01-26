const sessionTemplate = (data) => `
  <div class=" justify-center mx-auto rounded-xl mt-8 bg-white w-3/4 py-2 rounded-md shadow-lg px-4">
        <div class="text-center ">
            <p class="text-base md:text-xl font-bold text-gray-800">${data.session_type}</p>
            <p class="text-xl md:text-base text-gray-900">${data.session_desc}</p>
            <p class="text-xs md:text-base text-black">${data.start_time}</p>
            <p class="text-sm font-bold "><h2>${data.session_speaker_name} </h2></p>
            <a href="/#/scan/${data.session_id}"> <button class='bg-green-500 hover:bg-gray-700 text-white font-bold px-4 py-2 rounded my-3'>CHECK IN</button> </a> 

        </div>
  </div>
`;

export {
  sessionTemplate,
}