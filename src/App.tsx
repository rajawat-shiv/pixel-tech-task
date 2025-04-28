import { useState } from "react";
import { countries } from "./data/dummyData";
import { ComboBoxOption } from "./types/types";
import ComboBox from "./components/ComboBox";

function App() {
  const [selectedCountries, setSelectedCountries] = useState<ComboBoxOption[]>(
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">


        <div className="grid md:grid-cols-1 gap-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Select Countries (Multi-select)
            </h2>
            <ComboBox
              options={countries}
              placeholder="Search countries..."
              onChange={setSelectedCountries}
              multiSelect={true}
            />

            {selectedCountries.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-gray-700">
                  Selected:{" "}
                  <span className="font-medium text-blue-800">
                    {selectedCountries.map((c) => c.label).join(", ")}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
