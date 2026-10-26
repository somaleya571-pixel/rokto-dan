/**
 * Complete Bangladesh Administrative Divisions, all 64 Districts, Upazilas,
 * and comprehensive Medical Facilities (Colleges, District Hospitals, Upazila Health Complexes)
 */

export interface DistrictData {
  district: string;
  division: string;
  upazilas: string[];
}

export interface MedicalFacility {
  name: string;
  district: string;
  type: 'Medical College' | 'District Hospital' | 'Upazila Health Complex' | 'Specialized / Private';
  upazila?: string;
}

export const DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh'
] as const;

// -------------------------------------------------------------
// ALL 64 DISTRICTS OF BANGLADESH
// -------------------------------------------------------------
export const BANGLADESH_LOCATIONS: DistrictData[] = [
  // --- DHAKA DIVISION (13) ---
  {
    district: 'Dhaka',
    division: 'Dhaka',
    upazilas: [
      'Dhanmondi', 'Mirpur', 'Uttara', 'Gulshan', 'Mohammadpur', 'Savar', 'Keraniganj',
      'Motijheel', 'Banani', 'Badda', 'Tejgaon', 'Khilgaon', 'Rampura', 'Shahbagh',
      'Jatrabari', 'Lalbagh', 'Pallabi', 'Kafrul', 'Hazaribagh', 'Demra', 'Nawabganj', 'Dohar'
    ]
  },
  {
    district: 'Gazipur',
    division: 'Dhaka',
    upazilas: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Sreepur', 'Kapasia', 'Kaliganj']
  },
  {
    district: 'Narayanganj',
    division: 'Dhaka',
    upazilas: ['Narayanganj Sadar', 'Bandar', 'Fatullah', 'Siddhirganj', 'Rupganj', 'Araihazar', 'Sonargaon']
  },
  {
    district: 'Tangail',
    division: 'Dhaka',
    upazilas: ['Tangail Sadar', 'Mirzapur', 'Ghatail', 'Basail', 'Delduar', 'Gopalpur', 'Kalihati', 'Madhupur', 'Nagarpur', 'Sakhipur', 'Dhanbari', 'Bhuapur']
  },
  {
    district: 'Kishoreganj',
    division: 'Dhaka',
    upazilas: ['Kishoreganj Sadar', 'Bajitpur', 'Bhairab', 'Hossainpur', 'Itna', 'Karimganj', 'Katiadi', 'Kuliarchar', 'Mithamain', 'Nikli', 'Pakundia', 'Tarail']
  },
  {
    district: 'Manikganj',
    division: 'Dhaka',
    upazilas: ['Manikganj Sadar', 'Singair', 'Shibalaya', 'Saturia', 'Harirampur', 'Ghior', 'Daulatpur']
  },
  {
    district: 'Munshiganj',
    division: 'Dhaka',
    upazilas: ['Munshiganj Sadar', 'Tongibari', 'Sreenagar', 'Lauhajang', 'Gajaria', 'Sirajdikhan']
  },
  {
    district: 'Narsingdi',
    division: 'Dhaka',
    upazilas: ['Narsingdi Sadar', 'Belabo', 'Monohardi', 'Palash', 'Raipura', 'Shibpur']
  },
  {
    district: 'Faridpur',
    division: 'Dhaka',
    upazilas: ['Faridpur Sadar', 'Boalmari', 'Alfadanga', 'Madhukhali', 'Bhanga', 'Nagarkanda', 'Charbhadrasan', 'Sadarpur', 'Saltha']
  },
  {
    district: 'Gopalganj',
    division: 'Dhaka',
    upazilas: ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara']
  },
  {
    district: 'Madaripur',
    division: 'Dhaka',
    upazilas: ['Madaripur Sadar', 'Shibchar', 'Kalkini', 'Rajoir', 'Dasar']
  },
  {
    district: 'Rajbari',
    division: 'Dhaka',
    upazilas: ['Rajbari Sadar', 'Goalanda', 'Pangsha', 'Baliakandi', 'Kalukhali']
  },
  {
    district: 'Shariatpur',
    division: 'Dhaka',
    upazilas: ['Shariatpur Sadar', 'Naria', 'Zanjira', 'Bhedarganj', 'Damudya', 'Gosairhat']
  },

  // --- CHATTOGRAM DIVISION (11) ---
  {
    district: 'Chattogram',
    division: 'Chattogram',
    upazilas: [
      'Kotwali', 'Panchlaish', 'Agrabad', 'Halishahar', 'Hathazari', 'Sitakunda', 'Patiya',
      'Raozan', 'Fatikchhari', 'Boalkhali', 'Sandwip', 'Anwara', 'Chandanaish', 'Lohagara',
      'Mirsharai', 'Karnaphuli', 'Banshkhali'
    ]
  },
  {
    district: 'Cox\'s Bazar',
    division: 'Chattogram',
    upazilas: ['Cox\'s Bazar Sadar', 'Chakaria', 'Maheshkhali', 'Teknaf', 'Ukhia', 'Ramu', 'Pekua', 'Kutubdia']
  },
  {
    district: 'Cumilla',
    division: 'Chattogram',
    upazilas: [
      'Adarsha Sadar', 'Sadar Dakshin', 'Chandina', 'Daudkandi', 'Burichang', 'Debidwar',
      'Laksam', 'Barura', 'Brahmanpara', 'Chauddagram', 'Homna', 'Muradnagar', 'Meghna',
      'Monohargonj', 'Titas', 'Lalmai'
    ]
  },
  {
    district: 'Feni',
    division: 'Chattogram',
    upazilas: ['Feni Sadar', 'Daganbhuiyan', 'Chhagalnaiya', 'Sonagazi', 'Parshuram', 'Fulgazi']
  },
  {
    district: 'Brahmanbaria',
    division: 'Chattogram',
    upazilas: ['Brahmanbaria Sadar', 'Ashuganj', 'Akhaura', 'Bancharampur', 'Bijoynagar', 'Kasba', 'Nabinagar', 'Nasirnagar', 'Sarail']
  },
  {
    district: 'Noakhali',
    division: 'Chattogram',
    upazilas: ['Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Senbagh', 'Subarnachar', 'Kabirhat', 'Sonaimuri']
  },
  {
    district: 'Chandpur',
    division: 'Chattogram',
    upazilas: ['Chandpur Sadar', 'Faridganj', 'Haimchar', 'Hajiganj', 'Kachua', 'Matlab Dakshin', 'Matlab Uttar', 'Shahrasti']
  },
  {
    district: 'Lakshmipur',
    division: 'Chattogram',
    upazilas: ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar']
  },
  {
    district: 'Rangamati',
    division: 'Chattogram',
    upazilas: ['Rangamati Sadar', 'Kaptai', 'Kawkhali', 'Baghaichhari', 'Barkal', 'Bilaichhari', 'Juraichhari', 'Langadu', 'Naniarchar', 'Rajasthali']
  },
  {
    district: 'Khagrachhari',
    division: 'Chattogram',
    upazilas: ['Khagrachhari Sadar', 'Dighinala', 'Panchhari', 'Mahalchhari', 'Matiranga', 'Manikchhari', 'Ramgarh', 'Guimara']
  },
  {
    district: 'Bandarban',
    division: 'Chattogram',
    upazilas: ['Bandarban Sadar', 'Ruma', 'Thanchi', 'Rowangchhari', 'Lama', 'Alikadam', 'Naikhongchhari']
  },

  // --- RAJSHAHI DIVISION (8) ---
  {
    district: 'Rajshahi',
    division: 'Rajshahi',
    upazilas: ['Boalia', 'Motihar', 'Rajpara', 'Paba', 'Godagari', 'Tanore', 'Bagha', 'Charghat', 'Durgapur', 'Puthia', 'Bagmara', 'Mohanpur']
  },
  {
    district: 'Bogura',
    division: 'Rajshahi',
    upazilas: ['Bogura Sadar', 'Shibganj', 'Sherpur', 'Gabtali', 'Shajahanpur', 'Dhunat', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Sonatala', 'Adamdighi', 'Dupchanchia']
  },
  {
    district: 'Pabna',
    division: 'Rajshahi',
    upazilas: ['Pabna Sadar', 'Ishwardi', 'Santhia', 'Bera', 'Sujanagar', 'Chatmohar', 'Faridpur', 'Bhangura', 'Atgharia']
  },
  {
    district: 'Sirajganj',
    division: 'Rajshahi',
    upazilas: ['Sirajganj Sadar', 'Belkuchi', 'Chauhali', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Shahjadpur', 'Tarash', 'Ullahpara']
  },
  {
    district: 'Naogaon',
    division: 'Rajshahi',
    upazilas: ['Naogaon Sadar', 'Atrai', 'Badalgachhi', 'Dhamoirhat', 'Manda', 'Mohadevpur', 'Niamatpur', 'Patnitala', 'Porsha', 'Raninagar', 'Sapahar']
  },
  {
    district: 'Natore',
    division: 'Rajshahi',
    upazilas: ['Natore Sadar', 'Bagatipara', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Singra', 'Naldanga']
  },
  {
    district: 'Chapainawabganj',
    division: 'Rajshahi',
    upazilas: ['Chapainawabganj Sadar', 'Shibganj', 'Gomastapur', 'Nachole', 'Bholahat']
  },
  {
    district: 'Joypurhat',
    division: 'Rajshahi',
    upazilas: ['Joypurhat Sadar', 'Akkelpur', 'Kalai', 'Khetlal', 'Panchbibi']
  },

  // --- KHULNA DIVISION (10) ---
  {
    district: 'Khulna',
    division: 'Khulna',
    upazilas: ['Kotwali', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Rupsha', 'Batiaghata', 'Dumuria', 'Dighalia', 'Phultala', 'Paikgachha', 'Terokhada', 'Dacope', 'Koyra']
  },
  {
    district: 'Jashore',
    division: 'Khulna',
    upazilas: ['Jashore Sadar', 'Jhikargachha', 'Manirampur', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Keshabpur', 'Sharsha']
  },
  {
    district: 'Kushtia',
    division: 'Khulna',
    upazilas: ['Kushtia Sadar', 'Kumarkhali', 'Khoksa', 'Mirpur', 'Bheramara', 'Daulatpur']
  },
  {
    district: 'Jhenaidah',
    division: 'Khulna',
    upazilas: ['Jhenaidah Sadar', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa', 'Harinakunda']
  },
  {
    district: 'Satkhira',
    division: 'Khulna',
    upazilas: ['Satkhira Sadar', 'Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Shyamnagar', 'Tala']
  },
  {
    district: 'Bagerhat',
    division: 'Khulna',
    upazilas: ['Bagerhat Sadar', 'Chitalmari', 'Fakirhat', 'Kachua', 'Mollahat', 'Mongla', 'Morrelganj', 'Rampal', 'Sarankhola']
  },
  {
    district: 'Chuadanga',
    division: 'Khulna',
    upazilas: ['Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar']
  },
  {
    district: 'Meherpur',
    division: 'Khulna',
    upazilas: ['Meherpur Sadar', 'Gangni', 'Mujibnagar']
  },
  {
    district: 'Magura',
    division: 'Khulna',
    upazilas: ['Magura Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur']
  },
  {
    district: 'Narail',
    division: 'Khulna',
    upazilas: ['Narail Sadar', 'Kalia', 'Lohagara']
  },

  // --- BARISHAL DIVISION (6) ---
  {
    district: 'Barishal',
    division: 'Barishal',
    upazilas: ['Barishal Sadar', 'Babuganj', 'Wazirpur', 'Gournadi', 'Bakerganj', 'Banaripara', 'Agailjhara', 'Muladi', 'Hizla', 'Mehendiganj']
  },
  {
    district: 'Patuakhali',
    division: 'Barishal',
    upazilas: ['Patuakhali Sadar', 'Bauphal', 'Dashmina', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Dumki', 'Rangabali']
  },
  {
    district: 'Bhola',
    division: 'Barishal',
    upazilas: ['Bhola Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin']
  },
  {
    district: 'Pirojpur',
    division: 'Barishal',
    upazilas: ['Pirojpur Sadar', 'Bhandaria', 'Mathbaria', 'Nazirpur', 'Nesarabad', 'Kawkhali', 'Indurkani']
  },
  {
    district: 'Barguna',
    division: 'Barishal',
    upazilas: ['Barguna Sadar', 'Amtali', 'Bamna', 'Betagi', 'Patharghata', 'Taltali']
  },
  {
    district: 'Jhalokathi',
    division: 'Barishal',
    upazilas: ['Jhalokathi Sadar', 'Kathalia', 'Nalchity', 'Rajapur']
  },

  // --- SYLHET DIVISION (4) ---
  {
    district: 'Sylhet',
    division: 'Sylhet',
    upazilas: [
      'Sylhet Sadar', 'Kotwali', 'Amberkhana', 'South Surma', 'Beanibazar', 'Golapganj',
      'Jaintiapur', 'Kanaighat', 'Zakiganj', 'Balaganj', 'Biswanath', 'Fenchuganj',
      'Companiganj', 'Gowainghat', 'Osmani Nagar'
    ]
  },
  {
    district: 'Moulvibazar',
    division: 'Sylhet',
    upazilas: ['Moulvibazar Sadar', 'Barlekha', 'Juri', 'Kamalganj', 'Kulaura', 'Rajnagar', 'Sreemangal']
  },
  {
    district: 'Habiganj',
    division: 'Sylhet',
    upazilas: ['Habiganj Sadar', 'Ajmiriganj', 'Bahubal', 'Baniyachong', 'Chunarughat', 'Lakhai', 'Madhabpur', 'Nabiganj', 'Sayestaganj']
  },
  {
    district: 'Sunamganj',
    division: 'Sylhet',
    upazilas: ['Sunamganj Sadar', 'Bishwamvarpur', 'Chhatak', 'Derai', 'Dharamapasha', 'Dowarabazar', 'Jagannathpur', 'Jamalganj', 'Sullah', 'Tahirpur', 'Shantiganj']
  },

  // --- RANGPUR DIVISION (8) ---
  {
    district: 'Rangpur',
    division: 'Rangpur',
    upazilas: ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj']
  },
  {
    district: 'Dinajpur',
    division: 'Rangpur',
    upazilas: ['Dinajpur Sadar', 'Birampur', 'Birganj', 'Bochaganj', 'Chirirbandar', 'Fulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Nawabganj', 'Parbatipur']
  },
  {
    district: 'Gaibandha',
    division: 'Rangpur',
    upazilas: ['Gaibandha Sadar', 'Fulchhari', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Sughatta', 'Sundarganj']
  },
  {
    district: 'Kurigram',
    division: 'Rangpur',
    upazilas: ['Kurigram Sadar', 'Bhurungamari', 'Char Rajibpur', 'Chilmari', 'Nageshwari', 'Phulbari', 'Rajarhat', 'Rowmari', 'Ulipur']
  },
  {
    district: 'Lalmonirhat',
    division: 'Rangpur',
    upazilas: ['Lalmonirhat Sadar', 'Aditmari', 'Hatibandha', 'Kaliganj', 'Patgram']
  },
  {
    district: 'Nilphamari',
    division: 'Rangpur',
    upazilas: ['Nilphamari Sadar', 'Dimla', 'Domar', 'Jaldhaka', 'Kishoreganj', 'Saidpur']
  },
  {
    district: 'Panchagarh',
    division: 'Rangpur',
    upazilas: ['Panchagarh Sadar', 'Atwari', 'Boda', 'Debiganj', 'Tetulia']
  },
  {
    district: 'Thakurgaon',
    division: 'Rangpur',
    upazilas: ['Thakurgaon Sadar', 'Baliadangi', 'Haripur', 'Pirganj', 'Ranisankail']
  },

  // --- MYMENSINGH DIVISION (4) ---
  {
    district: 'Mymensingh',
    division: 'Mymensingh',
    upazilas: ['Mymensingh Sadar', 'Trishal', 'Muktagachha', 'Bhaluka', 'Phulpur', 'Gaffargaon', 'Haluaghat', 'Dhobaura', 'Ishwarganj', 'Nandail', 'Fulbaria', 'Tara Khanda']
  },
  {
    district: 'Jamalpur',
    division: 'Mymensingh',
    upazilas: ['Jamalpur Sadar', 'Bakshiganj', 'Dewanganj', 'Islampur', 'Madarganj', 'Melandaha', 'Sarishabari']
  },
  {
    district: 'Netrokona',
    division: 'Mymensingh',
    upazilas: ['Netrokona Sadar', 'Atpara', 'Barhatta', 'Durgapur', 'Kalmakanda', 'Kendua', 'Madan', 'Mohanganj', 'Purbadhala', 'Khaliajuri']
  },
  {
    district: 'Sherpur',
    division: 'Mymensingh',
    upazilas: ['Sherpur Sadar', 'Jhenaigati', 'Nakla', 'Nalitabari', 'Sreebardi']
  }
];

// -------------------------------------------------------------
// MEDICAL FACILITIES DATABASE
// Medical Colleges, District Hospitals, Upazila Health Complexes, Specialized
// -------------------------------------------------------------
export const MEDICAL_FACILITIES: MedicalFacility[] = [
  // --- DHAKA ---
  { name: 'Dhaka Medical College Hospital (DMCH)', district: 'Dhaka', type: 'Medical College', upazila: 'Shahbagh' },
  { name: 'BSMMU (PG Hospital)', district: 'Dhaka', type: 'Specialized / Private', upazila: 'Shahbagh' },
  { name: 'Sir Salimullah Medical College Mitford Hospital', district: 'Dhaka', type: 'Medical College', upazila: 'Lalbagh' },
  { name: 'Shaheed Suhrawardy Medical College Hospital', district: 'Dhaka', type: 'Medical College', upazila: 'Mohammadpur' },
  { name: 'National Institute of Cardiovascular Diseases (NICVD)', district: 'Dhaka', type: 'Specialized / Private', upazila: 'Mohammadpur' },
  { name: 'National Institute of Neurosciences & Hospital (NINS)', district: 'Dhaka', type: 'Specialized / Private', upazila: 'Mohammadpur' },
  { name: 'National Institute of Cancer Research & Hospital (NICRH)', district: 'Dhaka', type: 'Specialized / Private', upazila: 'Mohakhali' },
  { name: 'National Institute of Traumatology (Pongu Hospital)', district: 'Dhaka', type: 'Specialized / Private', upazila: 'Mohammadpur' },
  { name: 'Mugda Medical College Hospital', district: 'Dhaka', type: 'Medical College', upazila: 'Khilgaon' },
  { name: 'Kurmitola General Hospital', district: 'Dhaka', type: 'District Hospital', upazila: 'Cantonment' },
  { name: 'Combined Military Hospital (CMH Dhaka)', district: 'Dhaka', type: 'Specialized / Private', upazila: 'Cantonment' },
  { name: 'BIRDEM General Hospital', district: 'Dhaka', type: 'Specialized / Private', upazila: 'Shahbagh' },
  { name: 'Evercare Hospital Dhaka', district: 'Dhaka', type: 'Specialized / Private', upazila: 'Bashundhara' },
  { name: 'Square Hospital Dhaka', district: 'Dhaka', type: 'Specialized / Private', upazila: 'Panthapath' },
  { name: 'United Hospital Dhaka', district: 'Dhaka', type: 'Specialized / Private', upazila: 'Gulshan' },
  { name: 'Ibn Sina Hospital Dhanmondi', district: 'Dhaka', type: 'Specialized / Private', upazila: 'Dhanmondi' },
  { name: 'Labaid Specialized Hospital', district: 'Dhaka', type: 'Specialized / Private', upazila: 'Dhanmondi' },
  { name: 'Savar Upazila Health Complex', district: 'Dhaka', type: 'Upazila Health Complex', upazila: 'Savar' },
  { name: 'Keraniganj Upazila Health Complex', district: 'Dhaka', type: 'Upazila Health Complex', upazila: 'Keraniganj' },
  { name: 'Dhamrai Upazila Health Complex', district: 'Dhaka', type: 'Upazila Health Complex', upazila: 'Dhamrai' },
  { name: 'Nawabganj Upazila Health Complex', district: 'Dhaka', type: 'Upazila Health Complex', upazila: 'Nawabganj' },

  // --- GAZIPUR ---
  { name: 'Shaheed Tajuddin Ahmad Medical College Hospital', district: 'Gazipur', type: 'Medical College', upazila: 'Gazipur Sadar' },
  { name: 'Tongi 50-Bed Hospital', district: 'Gazipur', type: 'District Hospital', upazila: 'Tongi' },
  { name: 'Kaliakair Upazila Health Complex', district: 'Gazipur', type: 'Upazila Health Complex', upazila: 'Kaliakair' },
  { name: 'Sreepur Upazila Health Complex', district: 'Gazipur', type: 'Upazila Health Complex', upazila: 'Sreepur' },
  { name: 'Kapasia Upazila Health Complex', district: 'Gazipur', type: 'Upazila Health Complex', upazila: 'Kapasia' },

  // --- NARAYANGANJ ---
  { name: 'Narayanganj 300 Bed Hospital (Khanpur)', district: 'Narayanganj', type: 'District Hospital', upazila: 'Narayanganj Sadar' },
  { name: 'Narayanganj 100 Bed General Hospital (Victoria)', district: 'Narayanganj', type: 'District Hospital', upazila: 'Narayanganj Sadar' },
  { name: 'Rupganj Upazila Health Complex', district: 'Narayanganj', type: 'Upazila Health Complex', upazila: 'Rupganj' },
  { name: 'Araihazar Upazila Health Complex', district: 'Narayanganj', type: 'Upazila Health Complex', upazila: 'Araihazar' },
  { name: 'Sonargaon Upazila Health Complex', district: 'Narayanganj', type: 'Upazila Health Complex', upazila: 'Sonargaon' },

  // --- CHATTOGRAM ---
  { name: 'Chittagong Medical College Hospital (CMCH)', district: 'Chattogram', type: 'Medical College', upazila: 'Panchlaish' },
  { name: 'Chattogram General Hospital (Anderkilla)', district: 'Chattogram', type: 'District Hospital', upazila: 'Kotwali' },
  { name: 'Chattogram Maa-O-Shishu Hospital', district: 'Chattogram', type: 'Medical College', upazila: 'Agrabad' },
  { name: 'Hathazari Upazila Health Complex', district: 'Chattogram', type: 'Upazila Health Complex', upazila: 'Hathazari' },
  { name: 'Sitakunda Upazila Health Complex', district: 'Chattogram', type: 'Upazila Health Complex', upazila: 'Sitakunda' },
  { name: 'Patiya Upazila Health Complex', district: 'Chattogram', type: 'Upazila Health Complex', upazila: 'Patiya' },
  { name: 'Raozan Upazila Health Complex', district: 'Chattogram', type: 'Upazila Health Complex', upazila: 'Raozan' },
  { name: 'Fatikchhari Upazila Health Complex', district: 'Chattogram', type: 'Upazila Health Complex', upazila: 'Fatikchhari' },
  { name: 'Evercare Hospital Chattogram', district: 'Chattogram', type: 'Specialized / Private', upazila: 'Panchlaish' },

  // --- COX\'S BAZAR ---
  { name: 'Cox\'s Bazar Medical College Hospital', district: 'Cox\'s Bazar', type: 'Medical College', upazila: 'Cox\'s Bazar Sadar' },
  { name: 'Cox\'s Bazar 250 Bed District Sadar Hospital', district: 'Cox\'s Bazar', type: 'District Hospital', upazila: 'Cox\'s Bazar Sadar' },
  { name: 'Chakaria Upazila Health Complex', district: 'Cox\'s Bazar', type: 'Upazila Health Complex', upazila: 'Chakaria' },
  { name: 'Teknaf Upazila Health Complex', district: 'Cox\'s Bazar', type: 'Upazila Health Complex', upazila: 'Teknaf' },
  { name: 'Ukhia Upazila Health Complex', district: 'Cox\'s Bazar', type: 'Upazila Health Complex', upazila: 'Ukhia' },

  // --- CUMILLA ---
  { name: 'Cumilla Medical College Hospital (CuMCH)', district: 'Cumilla', type: 'Medical College', upazila: 'Adarsha Sadar' },
  { name: 'Cumilla 250 Bed General Hospital', district: 'Cumilla', type: 'District Hospital', upazila: 'Adarsha Sadar' },
  { name: 'Daudkandi Upazila Health Complex', district: 'Cumilla', type: 'Upazila Health Complex', upazila: 'Daudkandi' },
  { name: 'Chandina Upazila Health Complex', district: 'Cumilla', type: 'Upazila Health Complex', upazila: 'Chandina' },
  { name: 'Laksam Upazila Health Complex', district: 'Cumilla', type: 'Upazila Health Complex', upazila: 'Laksam' },

  // --- RAJSHAHI ---
  { name: 'Rajshahi Medical College Hospital (RMCH)', district: 'Rajshahi', type: 'Medical College', upazila: 'Rajpara' },
  { name: 'Rajshahi District Sadar Hospital', district: 'Rajshahi', type: 'District Hospital', upazila: 'Boalia' },
  { name: 'Godagari Upazila Health Complex', district: 'Rajshahi', type: 'Upazila Health Complex', upazila: 'Godagari' },
  { name: 'Paba Upazila Health Complex', district: 'Rajshahi', type: 'Upazila Health Complex', upazila: 'Paba' },
  { name: 'Puthia Upazila Health Complex', district: 'Rajshahi', type: 'Upazila Health Complex', upazila: 'Puthia' },
  { name: 'Charghat Upazila Health Complex', district: 'Rajshahi', type: 'Upazila Health Complex', upazila: 'Charghat' },

  // --- BOGURA ---
  { name: 'Shaheed Ziaur Rahman Medical College Hospital (SZRMCH)', district: 'Bogura', type: 'Medical College', upazila: 'Bogura Sadar' },
  { name: 'Mohammad Ali 250 Bed District Hospital', district: 'Bogura', type: 'District Hospital', upazila: 'Bogura Sadar' },
  { name: 'Sherpur Upazila Health Complex', district: 'Bogura', type: 'Upazila Health Complex', upazila: 'Sherpur' },
  { name: 'Shibganj Upazila Health Complex', district: 'Bogura', type: 'Upazila Health Complex', upazila: 'Shibganj' },

  // --- KHULNA ---
  { name: 'Khulna Medical College Hospital (KMCH)', district: 'Khulna', type: 'Medical College', upazila: 'Sonadanga' },
  { name: 'Khulna 250 Bed General Hospital', district: 'Khulna', type: 'District Hospital', upazila: 'Kotwali' },
  { name: 'Shahid Sheikh Abu Naser Specialized Hospital', district: 'Khulna', type: 'Specialized / Private', upazila: 'Khalishpur' },
  { name: 'Dumuria Upazila Health Complex', district: 'Khulna', type: 'Upazila Health Complex', upazila: 'Dumuria' },
  { name: 'Rupsha Upazila Health Complex', district: 'Khulna', type: 'Upazila Health Complex', upazila: 'Rupsha' },
  { name: 'Paikgachha Upazila Health Complex', district: 'Khulna', type: 'Upazila Health Complex', upazila: 'Paikgachha' },

  // --- JASHORE ---
  { name: 'Jashore Medical College Hospital', district: 'Jashore', type: 'Medical College', upazila: 'Jashore Sadar' },
  { name: 'Jashore 250 Bed General Hospital', district: 'Jashore', type: 'District Hospital', upazila: 'Jashore Sadar' },
  { name: 'Jhikargachha Upazila Health Complex', district: 'Jashore', type: 'Upazila Health Complex', upazila: 'Jhikargachha' },
  { name: 'Manirampur Upazila Health Complex', district: 'Jashore', type: 'Upazila Health Complex', upazila: 'Manirampur' },

  // --- BARISHAL ---
  { name: 'Sher-e-Bangla Medical College Hospital (SBMCH)', district: 'Barishal', type: 'Medical College', upazila: 'Barishal Sadar' },
  { name: 'Barishal 250 Bed District General Hospital', district: 'Barishal', type: 'District Hospital', upazila: 'Barishal Sadar' },
  { name: 'Babuganj Upazila Health Complex', district: 'Barishal', type: 'Upazila Health Complex', upazila: 'Babuganj' },
  { name: 'Gournadi Upazila Health Complex', district: 'Barishal', type: 'Upazila Health Complex', upazila: 'Gournadi' },
  { name: 'Bakerganj Upazila Health Complex', district: 'Barishal', type: 'Upazila Health Complex', upazila: 'Bakerganj' },

  // --- SYLHET ---
  { name: 'Sylhet MAG Osmani Medical College Hospital (SOMCH)', district: 'Sylhet', type: 'Medical College', upazila: 'Kotwali' },
  { name: 'Sylhet Shahid Shamsuddin Ahmed District Hospital', district: 'Sylhet', type: 'District Hospital', upazila: 'Kotwali' },
  { name: 'Jalalabad Ragib-Rabeya Medical College Hospital', district: 'Sylhet', type: 'Medical College', upazila: 'Sylhet Sadar' },
  { name: 'Beanibazar Upazila Health Complex', district: 'Sylhet', type: 'Upazila Health Complex', upazila: 'Beanibazar' },
  { name: 'Golapganj Upazila Health Complex', district: 'Sylhet', type: 'Upazila Health Complex', upazila: 'Golapganj' },
  { name: 'South Surma Upazila Health Complex', district: 'Sylhet', type: 'Upazila Health Complex', upazila: 'South Surma' },

  // --- RANGPUR ---
  { name: 'Rangpur Medical College Hospital (RpMCH)', district: 'Rangpur', type: 'Medical College', upazila: 'Rangpur Sadar' },
  { name: 'Rangpur 250 Bed District Sadar Hospital', district: 'Rangpur', type: 'District Hospital', upazila: 'Rangpur Sadar' },
  { name: 'Badarganj Upazila Health Complex', district: 'Rangpur', type: 'Upazila Health Complex', upazila: 'Badarganj' },
  { name: 'Mithapukur Upazila Health Complex', district: 'Rangpur', type: 'Upazila Health Complex', upazila: 'Mithapukur' },
  { name: 'Pirganj Upazila Health Complex', district: 'Rangpur', type: 'Upazila Health Complex', upazila: 'Pirganj' },

  // --- MYMENSINGH ---
  { name: 'Mymensingh Medical College Hospital (MMCH)', district: 'Mymensingh', type: 'Medical College', upazila: 'Mymensingh Sadar' },
  { name: 'Mymensingh 250 Bed District Sadar Hospital', district: 'Mymensingh', type: 'District Hospital', upazila: 'Mymensingh Sadar' },
  { name: 'Trishal Upazila Health Complex', district: 'Mymensingh', type: 'Upazila Health Complex', upazila: 'Trishal' },
  { name: 'Muktagachha Upazila Health Complex', district: 'Mymensingh', type: 'Upazila Health Complex', upazila: 'Muktagachha' },
  { name: 'Bhaluka Upazila Health Complex', district: 'Mymensingh', type: 'Upazila Health Complex', upazila: 'Bhaluka' },
  { name: 'Gaffargaon Upazila Health Complex', district: 'Mymensingh', type: 'Upazila Health Complex', upazila: 'Gaffargaon' },

  // --- OTHER DISTRICT HOSPITALS & HEALTH COMPLEXES ---
  { name: 'Tangail 250 Bed General Hospital', district: 'Tangail', type: 'District Hospital', upazila: 'Tangail Sadar' },
  { name: 'Sheikh Hasina Medical College Hospital Tangail', district: 'Tangail', type: 'Medical College', upazila: 'Tangail Sadar' },
  { name: 'Mirzapur Kumudini Hospital', district: 'Tangail', type: 'Specialized / Private', upazila: 'Mirzapur' },
  { name: 'Faridpur Bangabandhu Sheikh Mujib Medical College Hospital', district: 'Faridpur', type: 'Medical College', upazila: 'Faridpur Sadar' },
  { name: 'Faridpur 250 Bed General Hospital', district: 'Faridpur', type: 'District Hospital', upazila: 'Faridpur Sadar' },
  { name: 'Pabna Medical College Hospital', district: 'Pabna', type: 'Medical College', upazila: 'Pabna Sadar' },
  { name: 'Pabna 250 Bed General Hospital', district: 'Pabna', type: 'District Hospital', upazila: 'Pabna Sadar' },
  { name: 'Dinajpur M. Abdur Rahim Medical College Hospital', district: 'Dinajpur', type: 'Medical College', upazila: 'Dinajpur Sadar' },
  { name: 'Dinajpur 250 Bed General Hospital', district: 'Dinajpur', type: 'District Hospital', upazila: 'Dinajpur Sadar' },
  { name: 'Kushtia Medical College Hospital', district: 'Kushtia', type: 'Medical College', upazila: 'Kushtia Sadar' },
  { name: 'Kushtia 250 Bed General Hospital', district: 'Kushtia', type: 'District Hospital', upazila: 'Kushtia Sadar' },
  { name: 'Feni 250 Bed District Sadar Hospital', district: 'Feni', type: 'District Hospital', upazila: 'Feni Sadar' },
  { name: 'Brahmanbaria 250 Bed District Sadar Hospital', district: 'Brahmanbaria', type: 'District Hospital', upazila: 'Brahmanbaria Sadar' },
  { name: 'Noakhali 250 Bed General Hospital', district: 'Noakhali', type: 'District Hospital', upazila: 'Noakhali Sadar' },
  { name: 'Abdul Malek Ukil Medical College Hospital', district: 'Noakhali', type: 'Medical College', upazila: 'Noakhali Sadar' },
  { name: 'Chandpur 250 Bed General Hospital', district: 'Chandpur', type: 'District Hospital', upazila: 'Chandpur Sadar' },
  { name: 'Chandpur Medical College Hospital', district: 'Chandpur', type: 'Medical College', upazila: 'Chandpur Sadar' },
  { name: 'Sirajganj 250 Bed General Hospital', district: 'Sirajganj', type: 'District Hospital', upazila: 'Sirajganj Sadar' },
  { name: 'Shaheed M. Monsur Ali Medical College Hospital', district: 'Sirajganj', type: 'Medical College', upazila: 'Sirajganj Sadar' },
  { name: 'Jamalpur 250 Bed General Hospital', district: 'Jamalpur', type: 'District Hospital', upazila: 'Jamalpur Sadar' },
  { name: 'Sheikh Hasina Medical College Hospital Jamalpur', district: 'Jamalpur', type: 'Medical College', upazila: 'Jamalpur Sadar' },
  { name: 'Patuakhali Medical College Hospital', district: 'Patuakhali', type: 'Medical College', upazila: 'Patuakhali Sadar' },
  { name: 'Patuakhali 250 Bed District Hospital', district: 'Patuakhali', type: 'District Hospital', upazila: 'Patuakhali Sadar' },
  { name: 'Netrokona Medical College Hospital', district: 'Netrokona', type: 'Medical College', upazila: 'Netrokona Sadar' },
  { name: 'Gopalganj 250 Bed General Hospital', district: 'Gopalganj', type: 'District Hospital', upazila: 'Gopalganj Sadar' },
  { name: 'Sheikh Sayera Khatun Medical College Hospital', district: 'Gopalganj', type: 'Medical College', upazila: 'Gopalganj Sadar' },
  { name: 'Kishoreganj 250 Bed General Hospital', district: 'Kishoreganj', type: 'District Hospital', upazila: 'Kishoreganj Sadar' },
  { name: 'Shaheed Syed Nazrul Islam Medical College Hospital', district: 'Kishoreganj', type: 'Medical College', upazila: 'Kishoreganj Sadar' },
  { name: 'Manikganj 250 Bed District Hospital', district: 'Manikganj', type: 'District Hospital', upazila: 'Manikganj Sadar' },
  { name: 'Colonel Maleque Medical College Hospital', district: 'Manikganj', type: 'Medical College', upazila: 'Manikganj Sadar' },
  { name: 'Moulvibazar 250 Bed District Sadar Hospital', district: 'Moulvibazar', type: 'District Hospital', upazila: 'Moulvibazar Sadar' },
  { name: 'Habiganj 250 Bed District Sadar Hospital', district: 'Habiganj', type: 'District Hospital', upazila: 'Habiganj Sadar' },
  { name: 'Sheikh Hasina Medical College Hospital Habiganj', district: 'Habiganj', type: 'Medical College', upazila: 'Habiganj Sadar' },
  { name: 'Sunamganj 250 Bed District Sadar Hospital', district: 'Sunamganj', type: 'District Hospital', upazila: 'Sunamganj Sadar' },
  { name: 'Bangabandhu Medical College Hospital Sunamganj', district: 'Sunamganj', type: 'Medical College', upazila: 'Sunamganj Sadar' },
  { name: 'Satkhira Medical College Hospital', district: 'Satkhira', type: 'Medical College', upazila: 'Satkhira Sadar' },
  { name: 'Satkhira 250 Bed District Hospital', district: 'Satkhira', type: 'District Hospital', upazila: 'Satkhira Sadar' }
];

/**
 * Returns medical facilities matching the chosen district and optionally upazila.
 * If the district has specific hospitals listed, those appear first, followed by default/generated
 * facilities like District Sadar Hospital, Upazila Health Complex, or national specialty centres.
 */
export function getMedicalFacilities(district: string, upazila?: string): string[] {
  const result: string[] = [];

  // 1. Direct matched facilities from database
  const matched = MEDICAL_FACILITIES.filter(
    (f) => f.district.toLowerCase() === district.toLowerCase()
  );

  // If upazila matches, put those at top
  if (upazila) {
    const upazilaSpecific = matched.filter(
      (f) => f.upazila && f.upazila.toLowerCase() === upazila.toLowerCase()
    );
    upazilaSpecific.forEach((f) => {
      if (!result.includes(f.name)) result.push(f.name);
    });
  }

  // Add the remaining district matches
  matched.forEach((f) => {
    if (!result.includes(f.name)) result.push(f.name);
  });

  // 2. Ensure standard District Sadar Hospital and Upazila Health Complex are present
  if (district && district !== 'All') {
    const defaultSadar = `${district} 250 Bed District Sadar Hospital`;
    if (!result.includes(defaultSadar)) {
      result.push(defaultSadar);
    }

    if (upazila && upazila !== 'All') {
      const defaultUHC = `${upazila} Upazila Health Complex`;
      if (!result.includes(defaultUHC)) {
        result.push(defaultUHC);
      }
    }
  }

  // 3. For Dhaka or any major critical cases, append major national tertiary hospitals
  const tertiaryCentres = [
    'Dhaka Medical College Hospital (DMCH)',
    'BSMMU (PG Hospital)',
    'National Institute of Cardiovascular Diseases (NICVD)',
    'Shaheed Suhrawardy Medical College Hospital',
    'Square Hospital Dhaka',
    'Evercare Hospital Dhaka',
    'United Hospital Dhaka',
    'BIRDEM General Hospital'
  ];

  tertiaryCentres.forEach((h) => {
    if (!result.includes(h)) result.push(h);
  });

  return result;
}

// Blood Groups
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const BLOOD_COMPATIBILITY: Record<BloodGroup, { canReceiveFrom: BloodGroup[]; canDonateTo: BloodGroup[] }> = {
  'O-': {
    canReceiveFrom: ['O-'],
    canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
  },
  'O+': {
    canReceiveFrom: ['O-', 'O+'],
    canDonateTo: ['O+', 'A+', 'B+', 'AB+']
  },
  'A-': {
    canReceiveFrom: ['O-', 'A-'],
    canDonateTo: ['A-', 'A+', 'AB-', 'AB+']
  },
  'A+': {
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+'],
    canDonateTo: ['A+', 'AB+']
  },
  'B-': {
    canReceiveFrom: ['O-', 'B-'],
    canDonateTo: ['B-', 'B+', 'AB-', 'AB+']
  },
  'B+': {
    canReceiveFrom: ['O-', 'O+', 'B-', 'B+'],
    canDonateTo: ['B+', 'AB+']
  },
  'AB-': {
    canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'],
    canDonateTo: ['AB-', 'AB+']
  },
  'AB+': {
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canDonateTo: ['AB+']
  }
};
