

using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;
using NLog;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Data
{
    public static class InitialData
    {

        public static async void Seed(this EstrategyPolywebDbContext dbContext)
        {
            List<Address> addresses =
            [
                 new("Boerkensleen",
                    23,
                    "4705RL",
                    "Roosendaal",
                    "Netherlands",
                    "b") { ID = 1},
                new("Westerdoksdijk",
                    1,
                    "1013AD",
                    "Amsterdam",
                    "Netherlands") { ID = 2 },
                new("Jan van Lieshoutstraat",
                   23,
                    "5611EE",
                    "Eindhoven",
                    "Netherlands") { ID = 3 },
                new("place Stanislas",
                    151,
                    "541002",
                    "Nancy",
                    "France",
                    "A") { ID = 4 },
                new ("Nijverheidstraat",
                    15,
                    "7511JM",
                    "Enschede",
                    "Netherlands") { ID = 5 },
                new ("Jan Ligthartlaan",
                    125,
                    "3312KG",
                    "Dordrecht",
                   "Netherlands") { ID = 6 },
                new ("Wolfskers",
                    64,
                    "Venray",
                    "5803LX",
                    "Netherlands") { ID = 7 },
                new ("Gingerslaan",
                    153,
                    "4464VA",
                    "Goes",
                    "Netherlands") { ID = 8 },
                new ("Vondellaan",
                    81,
                    "1401SB",
                    "Bussum",
                    "Netherlands") { ID = 9 },
                new ("Dominee Bartelsstraat",
                    74,
                    "7141ZW",
                    "Groenlo",
                    "Netherlands") { ID = 10 },
                new ("Nachtegaalweg",
                    148,
                    "8191XX",
                    "Wapenveld",
                    "Netherlands") { ID = 11 },
                new ("Johannes Daniël van Suurmondstraat",
                    75,
                    "4461GH",
                    "Dordrecht",
                    "Netherlands") { ID = 12 },
                new ("A.V.H. Destreelaan",
                    7,
                    "1834EC",
                    "Sint Pancras",
                    "Netherlands") { ID = 13 },
                new ("Trooststraat",
                    146,
                    "Den Haag",
                    "2525GP",
                    "Netherlands") { ID = 14 },
                new ("Hofstraat",
                    23,
                    "5801BJ",
                    "Venray",
                    "Netherlands") { ID = 15 }
            ];

            List<Supplier> suppliers =
            [
                new("Smit Polyweb", 1) { ID = 1 },
                new("Rayen Elmira", 2) { ID = 2 },
                new("Piet van Doren", 3) { ID = 3 },
                new("Bo Rob", 4) { ID = 4 },
            ];

            List<Role> roles = [
                new Role("Admin", Enum.GetValues(typeof(Permission)).Cast<Permission>().ToList()) { ID = 1 }, // Give it an ID because of the getter referencing said ID
                new Role("Customer", [Permission.CertificateRead, Permission.UserRead, Permission.UserWrite, Permission.RoleRead, Permission.CustomerRead, Permission.UpdatePassword]) { ID = 2 }, // Give it an ID because of the getter referencing said ID
                new Role("CustomerRead", [Permission.CertificateRead, Permission.UpdatePassword]) { ID = 3}, // Give it an ID because of the getter referencing said ID
                new Role("Mechanic", [Permission.TicketRead,Permission.TicketWrite, Permission.CertificateRead,Permission.CertificateWrite, Permission.ArticleRead, Permission.CustomerRead, Permission.SupplierRead, Permission.AddressRead, Permission.AddressWrite, Permission.PropertyRead, Permission.UpdatePassword]) { ID = 4 } // Give it an ID because of the getter referencing said ID
            ];
            List<User> users =
            [
                new User(
                    "Gerard@gmail.com",
                    "Regen321",
                    "Gerard",
                    "De",
                    "Lange",
                    1,
                    true,
                    false,
                    null,
                    PasswordHashType.NotSet
                ) { ID = 1 },
                new User(
                    "customer@gmail.com",
                    "Customer123",
                    "Piet",
                    null,
                    "Herder",
                    2,
                    true,
                    false,
                    1,
                    PasswordHashType.NotSet
                ) { ID = 2 },
                new User(
                    "stageMail@example.com",
                    "stage2024",
                    "Elize",
                    "De",
                    "Boer",
                    1,
                    true,
                    false,
                    null,
                    PasswordHashType.NotSet
                ) { ID = 3 },
                 new User(
                    "customerread@gmail.com",
                    "Read123",
                    "Piet",
                    null,
                    "Herder",
                    3,
                    true,
                    false,
                    2,
                    PasswordHashType.NotSet
                ) { ID = 4 },
                 new User(
                    "mechanic@gmail.com",
                    "Mechanic123",
                    "Piet",
                    null,
                    "Herder",
                    4,
                    true,
                    false,
                    null,
                    PasswordHashType.NotSet
                ) { ID = 5 },
                // new User(
                //    "Piet3@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    true,
                //    false,
                //    3,
                //    PasswordHashType.NotSet
                //) { ID = 6 },
                // new User(
                //    "Piet4@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    false,
                //    true,
                //    1,
                //    PasswordHashType.NotSet
                //) { ID = 7 },
                // new User(
                //    "Piet5@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    true,
                //    false,
                //    1,
                //    PasswordHashType.NotSet
                //) { ID = 8 },
                // new User(
                //    "Piet6@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    true,
                //    false,
                //    1,
                //    PasswordHashType.NotSet
                //) { ID = 9 },
                // new User(
                //    "Piet7@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    true,
                //    false,
                //    1,
                //    PasswordHashType.NotSet
                //) { ID = 10 },
                // new User(
                //    "Piet8@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    true,
                //    false,
                //    1,
                //    PasswordHashType.NotSet
                //) { ID = 11 },
                // new User(
                //    "Piet9@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    true,
                //    false,
                //    2,
                //    PasswordHashType.NotSet
                //) { ID = 12 },
                // new User(
                //    "Piet10@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    true,
                //    false,
                //    3,
                //    PasswordHashType.NotSet
                //) { ID = 13 },
                // new User(
                //    "Piet11@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    true,
                //    false,
                //    null,
                //    PasswordHashType.NotSet
                //) { ID = 14 },
                // new User(
                //    "Piet12@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    true,
                //    false,
                //    1,
                //    PasswordHashType.NotSet
                //) { ID = 15 },
                // new User(
                //    "Piet13@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    true,
                //    false,
                //    1,
                //    PasswordHashType.NotSet
                //) { ID = 16 },
                // new User(
                //    "Piet14@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    false,
                //    true,
                //    2,
                //    PasswordHashType.NotSet
                //) { ID = 17 }, new User(
                //    "Piet15@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    true,
                //    false,
                //    3,
                //    PasswordHashType.NotSet
                //) { ID = 18 }, new User(
                //    "Piet16@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    true,
                //    false,
                //    null,
                //    PasswordHashType.NotSet
                //) { ID = 19 },
                // new User(
                //    "Piet17@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    true,
                //    false,
                //    1,
                //    PasswordHashType.NotSet
                //) { ID = 20 },
                // new User(
                //    "Piet18@gmail.com",
                //    "WachtWoord2008",
                //    "Piet",
                //    null,
                //    "Herder",
                //    2,
                //    true,
                //    false,
                //    2,
                //    PasswordHashType.NotSet
                //) { ID = 21}

            ];

            List<Customer> customers =
            [
                new Customer(
                    "home@gmail.com",
                    "12ve",
                    "HomeCompany",
                    "HomerThuisbedrijflocatieAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "1234567890",
                    "123456fe436egr450",
                    1,
                    1,
                    3
                ) { ID = 1 },
                new Customer(
                    "matsbv@outlook.com",
                    "3436jegi",
                    "Mats",
                    "Mats",
                    "347635734",
                    "34gmp36jipjfpin43",
                    2,
                    2,
                    1
                ) { ID = 2 },
                new Customer(
                    "farmer@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 3 },
                 new Customer(
                    "farmer1@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 4 },
                 new Customer(
                    "farmer2@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 5 },
                 new Customer(
                    "farmer3@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 6 },
                 new Customer(
                    "farmer4@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 7 },
                 new Customer(
                    "farmer5@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 8 },
                 new Customer(
                    "farmer6@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 9 },
                 new Customer(
                    "farmer7@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 10},
                 new Customer(
                    "farmer8@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 11 },
                 new Customer(
                    "farmer9@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 12 },
                 new Customer(
                    "farmer10@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 13 },
                 new Customer(
                    "farmer11@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 14 },
                 new Customer(
                    "farmer12@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 15 },
                 new Customer(
                    "farmer13@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 16 },
                 new Customer(
                    "farmer14@gmail.com",
                    "hbtrrt5464",
                    "FarmerTrucks",
                    "Farmer",
                    "75454365437",
                    "34643gdrg43dg4t",
                    1,
                    1,
                    2
                ) { ID = 17 },

            ];

            List<ChecklistField> checklistFields = [
                new ChecklistField(
                    "Checked on Location",
                    false
                ) { ID = 1 },
                new ChecklistField(
                    "Safety check",
                    true
                ) { ID = 2 },
                new ChecklistField(
                    "Quality check",
                    false
                ) { ID = 3 }
            ];


            List<Property> properties = [
      new Property(
                                "Lengte precies",
                                "Lengte",
                                "length",
                                1
                            ) { ID = 1 },
                            new Property(
                                "gewicht precies",
                                "gewicht",
                                "weight",
                                2
                            )  { ID = 2 },
                            new Property(
                                "hoogte precies",
                                "hoogte",
                                "height",
                                3
                            )  { ID = 3 }
  ];



            List<Checklist> checklists = [
                new Checklist(
                    "Article checker",
                    [1, 2, 3],
                    [1]
                ) { ID = 1 }
            ];

            List<ArticleType> articleTypes =
            [
                new(
               "Hijsapparatuur",
                50.53
                ) { ID = 1 },
                 new ("Kettingwerk en haken",
                 102.53
                ) { ID = 2 },
                  new ("ValBeveiliging",
                  27623.73
                ) { ID = 3 }
            ];

            List<Article> articles =
            [
                new("Lewis handkettingtakel",
                    "Een handketting",
                    "152638",
                    1

                ){ID = 1 },
                new ("Yale Handy",
                    "Een haak die zwaardere gewichten kan heffen.",
                    "937460",
                    2

                ){ID = 2 },
                new ("Eller Balkenklem",
                    "Grote balk klem met verschillende opties in kleur",
                    "658204",
                    3

                ){ID = 3 },
            ];

            List<CertificateType> certificateTypes = [
                new CertificateType(
                    name: "eindgebruiker",
                    description: "type certificaat voor eindgebruikers"
                    ){ ID = 1 },
                    new CertificateType(
                        name: "tussenhandel",
                        description: "Type certificaat voor tussenhandel"
                        ){ ID = 2 },

                ];

            List<Certificate> certificates = [
                new Certificate(
                    certificateTypeID: 1,
                    customerID: 1,
                    supplierAddressID:1,
                    customerAddressID:1,
                    supplierID: 1,
                    workType: "Inspect",
                    supplyDate: DateTime.Now.AddDays(-13).AddMonths(-2),
                    extraInfo: "0112",
                    expirationDate: DateTime.Now.AddDays(5),
                    registrationNumber: 152624,
                    debtorNumber: "12ve",
                    description:"Trekhaak",
                    customerSearchName: "Homer",
                    customerReferenceNumber: "655326",
                    articleID: 2,
                    dateOfInspection: DateTime.Now
                ) { ID = 1 },
                new Certificate(
                    certificateTypeID: 2,
                    customerID: 2,
                    supplierID: 1,
                    supplierAddressID:1,
                    customerAddressID:1,
                    workType: "reUse",
                    supplyDate: DateTime.Now.AddDays(-15).AddMonths(-14).AddYears(-4),
                    extraInfo: "0112",                    expirationDate: DateTime.Now.AddDays(40),
                    registrationNumber: 932543,
                    debtorNumber: "3436jegi",
                    description:"Oogbout",
                    customerSearchName: "Polyweb",
                    customerReferenceNumber: "934573",
                    articleID: 3,
                    dateOfInspection: DateTime.Now.AddMonths(-2).AddDays(-25)

                ) { ID = 2 },
                new Certificate(
                    certificateTypeID: 1,
                    customerID: 3,
                    supplierID: 1,
                    supplierAddressID:1,
                    customerAddressID:1,
                    workType: "InspectAndTest",
                    supplyDate: DateTime.Now.AddDays(-3),
                    extraInfo: "0112",
                    expirationDate: DateTime.Now.AddDays(21).AddMonths(7).AddYears(4),
                    registrationNumber: 456434,
                    debtorNumber: "hbtrrt5464",
                     description:"Takel",
                    customerSearchName: "Klant123",
                    customerReferenceNumber: "940183",
                    articleID: 2,
                    dateOfInspection: DateTime.Now.AddMonths(-100).AddDays(-742)
                ) { ID = 3 }
            ];

            List<Ticket> tickets = [
                new Ticket(
                    153532,
                    "Description",
                    DateTime.Today,
                    TicketStatus.Status1,
                    1,
                    1,
                    5,
                    1,
                    "Homer",
                    "Gerard"
                ) { ID = 1 },
                new Ticket(
                    946263,
                    "Description",
                    DateTime.Today,
                    TicketStatus.Status2,
                    2,
                    2,
                    5,
                    2,
                    "Homer",
                    "Gerard"
                ) { ID = 2 },
                new Ticket(
                    237415,
                    "Description",
                    DateTime.Today,
                    TicketStatus.Status3,
                    3,
                    3,
                    5,
                    3,
                    "Homer",
                    "Gerard"
                ) { ID = 3 },
                          new Ticket(
                    436436,
                    "Description",
                    DateTime.Today,
                    TicketStatus.Status3,
                    3,
                    3,
                    5,
                    3,
                    "Homer",
                    "Gerard"
                ) { ID = 4 },
                          new Ticket(
                    346436,
                    "Description",
                    DateTime.Today,
                    TicketStatus.Status3,
                    3,
                    3,
                    5,
                    3,
                    "Homer",
                    "Gerard"
                ) { ID = 5 },
                          new Ticket(
                    754747,
                    "Description",
                    DateTime.Today,
                    TicketStatus.Status3,
                    3,
                    3,
                    5,
                    3,
                    "Homer",
                    "Gerard"
                ) { ID = 6 },
                          new Ticket(
                    374873,
                    "Description",
                    DateTime.Today,
                    TicketStatus.Status3,
                    3,
                    3,
                    5,
                    3,
                    "Homer",
                    "Gerard"
                ) { ID = 7 },

            ];


            if (!dbContext.Properties.Any())
                await dbContext.Properties.AddRangeAsync(properties);

            if (!dbContext.Addresses.Any())
                await dbContext.Addresses.AddRangeAsync(addresses);

            if (!dbContext.Checklists.Any())
                await dbContext.Checklists.AddRangeAsync(checklists);

            if (!dbContext.Suppliers.Any())
                await dbContext.Suppliers.AddRangeAsync(suppliers);

            if (!dbContext.Roles.Any())
                await dbContext.Roles.AddRangeAsync(roles);

            if (!dbContext.Users.Any())
                await dbContext.Users.AddRangeAsync(users);

            if (!dbContext.Customers.Any())
                await dbContext.Customers.AddRangeAsync(customers);

            if (!dbContext.ChecklistFields.Any())
                await dbContext.ChecklistFields.AddRangeAsync(checklistFields);

            if (!dbContext.ArticleTypes.Any())
                await dbContext.ArticleTypes.AddRangeAsync(articleTypes);

            if (!dbContext.Articles.Any())
                await dbContext.Articles.AddRangeAsync(articles);

            if (!dbContext.CertificateTypes.Any())
                await dbContext.CertificateTypes.AddRangeAsync(certificateTypes);

            if (!dbContext.Certificates.Any())
                await dbContext.Certificates.AddRangeAsync(certificates);

            if (!dbContext.Tickets.Any())
                await dbContext.Tickets.AddRangeAsync(tickets);


            dbContext.CurrentUser = users.SingleOrDefault(u => u.ID == 1);

            await dbContext.SaveChangesAsync();
        }

        public static void AddMoreCertificates(this EstrategyPolywebDbContext dBcontext, int amount)
        {
            var logger = LogManager.GetCurrentClassLogger();

            logger.Info("!!! 5 second untill certificate creation !!!");

            Thread.Sleep(5000);

            Random rand = new Random();

            List<ArticleType> artTypeList = dBcontext.ArticleTypes.ToList();

            List<CertificateType> ctList = dBcontext.CertificateTypes.ToList();

            List<Customer> ctmrList = dBcontext.Customers.ToList();

            List<Address> aList = dBcontext.Addresses.ToList();

            List<Supplier> sList = dBcontext.Suppliers.ToList();

            List<string> wList = ["newlyDelivered", "inspect", "inspectAndTest", "rejected", "outOfOrder", "reUse"];

            List<string> dList = ["Trekhaak", "Polyflex rondstrop", "Duplex lifting sling", "Hijsband", "Lifting roundsling", "Liftingsling", "2 delige ladder", "Balkenklem", "Duwloopkat", "Eindloze ketting met Vatenschakel", "Wide moutgh shackle", "Kelderwinde"];

            List<Certificate> cList = [];

            Dictionary<Customer, int> refNumber = [];

            foreach (Customer ctmr in ctmrList)
            {
                refNumber.Add(ctmr, rand.Next(100000, 999999));
            }

            for (int i = amount; i > 0; i--)
            {
                Customer selectedCustomer = ctmrList[rand.Next(1, ctmrList.Count)];
                Supplier selectedSupplier = sList[rand.Next(1, sList.Count)];

                DateTime supplyDate = DateTime.Now.AddYears(rand.Next(-10, 0)).AddDays(rand.Next(-365, 0)).AddMonths(rand.Next(-12, 0));

                cList.Add(new Certificate(
                    certificateTypeID: ctList[rand.Next(1, ctList.Count)].ID,
                    customerID: selectedCustomer.ID,
                    customerAddressID: selectedCustomer.AddressID,
                    supplierAddressID: selectedSupplier.AddressID,
                    supplierID: sList[rand.Next(1, sList.Count)].ID,
                    workType: wList[rand.Next(1, wList.Count)],
                    supplyDate: supplyDate,
                    extraInfo: "0112",
                    expirationDate: supplyDate.AddDays(rand.Next(0, 365)).AddMonths(rand.Next(0, 12)).AddYears(rand.Next(0, 5)),
                    registrationNumber: i,
                    debtorNumber: selectedCustomer.DebtorNumber,
                    description: dList[rand.Next(1, dList.Count)],
                    customerSearchName: selectedCustomer.SearchName,
                    customerReferenceNumber: $"{refNumber[selectedCustomer]}",
                    articleID: 2,
                    dateOfInspection: DateTime.Now.AddMonths(rand.Next(-1000, -1)).AddDays(rand.Next(-1000, -1))
                )
                { Status = (CertificateStatus)rand.Next(0, 4) });
            }

            dBcontext.CurrentUser = dBcontext.Users.FirstOrDefault(u => u.ID == 1);

            dBcontext.Certificates.AddRange(cList);

            dBcontext.SaveChanges();
        }
    }
}
