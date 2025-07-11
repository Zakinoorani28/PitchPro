import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, FileText, Palette, Users, Download, Play } from 'lucide-react';

export default function WorkflowGuide() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How ProtoLab Works: Simple 3-Step Process
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            From business idea to investor-ready presentation in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Step 1 */}
          <Card className="relative bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
            </div>
            <CardHeader className="pt-8 text-center">
              <FileText className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Generate Content</CardTitle>
              <CardDescription>
                Enter your business details and let AI create professional pitch content
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Describe your business idea</li>
                <li>• AI analyzes African markets</li>
                <li>• Creates 8-10 professional slides</li>
                <li>• Includes market insights</li>
              </ul>
              <Button 
                onClick={() => scrollToSection('generator')}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Start Here
              </Button>
            </CardContent>
          </Card>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <ArrowDown className="w-8 h-8 text-orange-400 transform rotate-90" />
          </div>

          {/* Step 2 */}
          <Card className="relative bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
            </div>
            <CardHeader className="pt-8 text-center">
              <Palette className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Customize Design</CardTitle>
              <CardDescription>
                Apply professional templates and African cultural themes
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Choose from 8 templates</li>
                <li>• Select African cultural themes</li>
                <li>• Customize colors and fonts</li>
                <li>• Preview your design</li>
              </ul>
              <Button 
                onClick={() => scrollToSection('pitch-deck-customizer')}
                variant="outline"
                className="w-full"
              >
                Customize Design
              </Button>
            </CardContent>
          </Card>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <ArrowDown className="w-8 h-8 text-orange-400 transform rotate-90" />
          </div>

          {/* Step 3 */}
          <Card className="relative bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
            </div>
            <CardHeader className="pt-8 text-center">
              <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Access Funding</CardTitle>
              <CardDescription>
                Find grants, collaborate on proposals, and secure funding
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Match with African funders</li>
                <li>• Collaborate with teams</li>
                <li>• Track proposal progress</li>
                <li>• Download final presentations</li>
              </ul>
              <Button 
                onClick={() => scrollToSection('grant-intelligence')}
                variant="outline"
                className="w-full"
              >
                Find Funding
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-orange-100">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Quick Start Options</h3>
            <p className="text-gray-600">Choose how you want to begin your journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="bg-orange-50 rounded-lg p-6 mb-4">
                <Play className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Watch the Demo</h4>
                <p className="text-sm text-gray-600 mb-4">
                  See the complete workflow with GreenHarvest Kenya example
                </p>
                <Button 
                  onClick={() => scrollToSection('demo-showcase')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  View Demo
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-50 rounded-lg p-6 mb-4">
                <Download className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Download Sample</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Get a sample AgriTech pitch deck to see our quality
                </p>
                <Button 
                  variant="outline"
                  onClick={() => window.open('/api/pitch/10/download', '_blank')}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Instructions */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
              !
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">Important: Follow the Correct Order</h4>
              <p className="text-amber-700 text-sm">
                <strong>First:</strong> Generate your pitch content using the form below
                <br />
                <strong>Then:</strong> Customize the design with templates and themes
                <br />
                <strong>Finally:</strong> Find grants and collaborate with team members
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}