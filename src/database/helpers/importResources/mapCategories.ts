// Mappings are sorted alphabetically by their returned category

const mapCategories = (category: string) => {
  switch (category.toLowerCase()) {
    case 'auto & transport':
    case 'auto payment':
      return 'Automotive';

    case 'allowance':
      return 'Allowance';

    case 'alcohol & bars':
      return 'Bars';

    case 'business & services':
    case 'advertising':
    case 'printing':
    case 'shipping':
      return 'Business & services';

    case 'book & suppies':
      return 'Books & supplies';

    case 'charity':
      return 'Charity';

    case 'babysitter & daycare':
      return 'Childcare';

    case 'clothing':
      return 'Clothing';

    case 'coffee shops':
      return 'Coffee shops';

    case 'education':
    case 'tuition':
      return 'Education';

    case 'electronics & software':
      return 'Electronics';

    case 'entertainment':
    case 'arts':
    case 'movies & dvds':
    case 'newspapers & magazines':
      return 'Entertainment & recreation';

    case 'health & fitness':
    case 'gym':
      return 'Fitness';

    case 'fees & charges':
    case 'atm fee':
    case 'bank fee':
    case 'finance charge':
    case 'late fee':
    case 'service fee':
    case 'trade comissions':
      return 'Fees';

    case 'financial':
    case 'income':
    case 'reimbursement':
    case 'returned purchase':
    case 'transfer for cash spending':
    case 'cash & atm':
    case 'check':
      return 'Financial & banking';

    case 'financial advisor':
      return 'Financial services';

    case 'food & dining':
      return 'Food & drink';

    case 'furnishings':
      return 'Furnishings';

    case 'gas & fuel':
      return 'Gas stations';

    case 'gift':
    case 'gifts & donations':
      return 'Gifts';

    case 'groceries':
      return 'Groceries';

    case 'dentist':
    case 'doctor':
    case 'dyecare':
    case 'health insurance':
      return 'Health';

    case 'hobbies':
      return 'Hobbies';

    case 'home improvement':
    case 'Lawn & Garden':
      return 'Home maintenance';

    case 'home':
    case 'home services':
    case 'home supplies':
    case 'mortgage & rent':
      return 'Housing';

    case 'rental income':
      return 'Income';

    case 'insurance':
    case 'auto insurance':
    case 'life insurance':
    case 'home insurance':
      return 'Insurance';

    case 'interest income':
      return 'Interest';

    case 'home phone':
    case 'mobile phone':
    case 'internet':
      return 'Internet & phone';

    case 'kids':
    case 'child support':
    case 'kids activities':
      return 'Kids';

    case 'baby supplies':
      return 'Kids supplies';

    case 'legal':
      return 'Legal';

    case 'hotel':
      return 'Lodging';

    case 'music':
      return 'Music';

    case 'amusement':
      return 'Outdoors & parks';

    case 'parking':
      return 'Parking';

    case 'credit card payment':
      return 'Payments';

    case 'bonus':
    case 'paycheck':
      return 'Payroll & benefits';

    case 'personal care':
    case 'hair':
    case 'laundry':
    case 'spa & massage':
      return 'Personal care';

    case 'pets':
    case 'pet food & supplies':
      return 'Pets';

    case 'pet grooming':
      return 'Pet services';

    case 'pharmacy':
      return 'Pharmacies';

    case 'public transportation':
      return 'Public transportation';

    case 'fast food':
      return 'Restaurants';

    case 'service & parts':
      return 'Service & parts';

    case 'shopping':
    case 'books':
    case 'sporting goods':
      return 'Shops';

    case 'sports':
      return 'Sports';

    case 'student loan':
      return 'Student loan';

    case 'taxes':
    case 'federal tax':
    case 'local tax':
    case 'property tax':
    case 'sales tax':
      return 'Taxes';

    case 'rental car & taxi':
      return 'Taxi & ride sharing';

    case 'television':
      return 'Television';

    case 'transfer':
    case 'transfers':
      return 'Transfers';

    case 'travel':
    case 'air travel':
      return 'Travel';

    case 'toys':
      return 'Toys';

    case 'utilities':
    case 'bills & utilities':
      return 'Utilities';

    case 'vacation':
    case 'holidays':
      return 'Vacation';

    case 'veterinary':
      return 'Veterinary';

    default:
      return 'Uncategorized';
  }
};

export default mapCategories;
