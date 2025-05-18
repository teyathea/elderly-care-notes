export default function Home(){
    return (
        <>
        {/* <div class="bg-black text-white min-h-screen p-6 font-[Poppins]"> */}
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="border-2 border-black rounded-xl p-4">
      <h2 class="text-orange-400 text-lg font-bold mb-2">Meds of the day</h2>
      <ul class="space-y-1">
        <li>6AM - Metformin</li>
        <li>12NN - Telmisartan</li>
        <li>6PM - Melatonin</li>
      </ul>
    </div>


    <div class="border-2 border-black rounded-xl p-4">
      <h2 class="text-orange-400 text-lg font-bold mb-2">Upcoming Appointment</h2>
      <ul class="space-y-1">
        <li class="flex justify-between"><span>Heart Checkup</span><span>05/19/25</span></li>
        <li class="flex justify-between"><span>Ear Checkup</span><span>05/19/25</span></li>
        <li class="flex justify-between"><span>Laboratory</span><span>05/15/25</span></li>
        <li class="flex justify-between"><span>Chest X-ray</span><span>05/16/25</span></li>
      </ul>
    </div>
  </div>

  <div class="border-2 border-black rounded-xl p-4 mt-4">
    <h2 class="text-black font-semibold mb-2">Notes:</h2>
    <div class="w-full bg-transparent text-black border-none outline-none resize-none h-24"></div>
  </div>

  <div class="border-2 border-black rounded-xl p-4 mt-4">
    <h2 class="text-orange-400 text-lg font-bold mb-4 text-center">Graph</h2>
    <div class="flex items-end justify-around h-40">
      <div class="bg-blue-500 w-8 h-20"></div>
      <div class="bg-pink-400 w-8 h-10"></div>
      <div class="bg-orange-500 w-8 h-28"></div>
      <div class="bg-green-400 w-8 h-16"></div>
    </div>
    <div class="flex justify-around text-sm mt-2 text-black">
      <span>Metformin</span>
      <span>Rabies</span>
      <span>Dogs</span>
      <span>Cats</span>
    </div>
  </div>
{/* </div> */}

        </>
    )
}