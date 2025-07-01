// Ultra-fast Menu page using SSG with ISR - FASTEST rendering technique
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Menu - My Hibachi Chef | Hibachi Catering Menu',
    description: 'Explore our premium hibachi menu featuring fresh meats, seafood, vegetables, and signature sauces.',
    keywords: 'hibachi menu, japanese food, steak, chicken, shrimp, vegetables, catering menu',
  };
}

// Server Component for ultra-fast static rendering
export default function MenuPage() {
  const menuData = {
    proteins: [
      { name: "Hibachi Chicken", price: "$25", description: "Tender chicken breast with hibachi seasonings" },
      { name: "Hibachi Steak", price: "$35", description: "Premium sirloin steak cooked to perfection" },
      { name: "Hibachi Shrimp", price: "$30", description: "Fresh jumbo shrimp with garlic butter" },
      { name: "Hibachi Salmon", price: "$32", description: "Atlantic salmon with teriyaki glaze" }
    ],
    vegetables: [
      { name: "Hibachi Vegetables", price: "$15", description: "Zucchini, onions, mushrooms, and carrots" },
      { name: "Fried Rice", price: "$12", description: "Japanese-style fried rice with egg and seasonings" },
      { name: "Hibachi Noodles", price: "$14", description: "Yakisoba noodles with vegetables" }
    ],
    packages: [
      { name: "Basic Package", price: "$40/person", items: ["Choice of protein", "Vegetables", "Fried rice", "Salad"] },
      { name: "Premium Package", price: "$55/person", items: ["Choice of 2 proteins", "Vegetables", "Fried rice", "Noodles", "Salad", "Soup"] }
    ]
  };

  return (
    <div className="menu-page">
      <div className="container py-5">
        <h1 className="display-4 text-center mb-5">Our Menu</h1>
        
        {/* Proteins Section */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="text-center mb-4">Premium Proteins</h2>
            <div className="row">
              {menuData.proteins.map((item, index) => (
                <div key={index} className="col-lg-6 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title">{item.name}</h5>
                        <span className="badge bg-primary fs-6">{item.price}</span>
                      </div>
                      <p className="card-text text-muted">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vegetables & Sides Section */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="text-center mb-4">Vegetables & Sides</h2>
            <div className="row">
              {menuData.vegetables.map((item, index) => (
                <div key={index} className="col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title">{item.name}</h5>
                        <span className="badge bg-success fs-6">{item.price}</span>
                      </div>
                      <p className="card-text text-muted">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Packages Section */}
        <div className="row">
          <div className="col-12">
            <h2 className="text-center mb-4">Catering Packages</h2>
            <div className="row justify-content-center">
              {menuData.packages.map((pkg, index) => (
                <div key={index} className="col-lg-5 mb-4">
                  <div className="card h-100 border-primary">
                    <div className="card-header bg-primary text-white">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">{pkg.name}</h5>
                        <strong>{pkg.price}</strong>
                      </div>
                    </div>
                    <div className="card-body">
                      <ul className="list-unstyled">
                        {pkg.items.map((item, idx) => (
                          <li key={idx} className="mb-2">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ISR - regenerate every 6 hours (menu doesn't change often) - FASTEST for static content
export const revalidate = 21600; // 6 hours
