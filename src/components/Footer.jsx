import React from 'react'

const Footer = () => {
  return (
	<div>
	   <footer className="bottom-0 w-full py-10 px-6 bg-gray-800 text-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <a href="#" className="text-2xl font-bold text-white">Co<span className="text-blue-400">Space</span></a>
              <p className="mt-2">Modern workspaces for modern professionals</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <div>
                <h4 className="font-semibold text-white mb-3">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#spaces" className="hover:text-white">Spaces</a></li>
                  <li><a href="#amenities" className="hover:text-white">Amenities</a></li>
                  <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Contact</h4>
                <ul className="space-y-2">
                  <li>hello@cospace.com</li>
                  <li>1-800-CO-SPACE</li>
                  <li>123 Main Street</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; {new Date().getFullYear()} CoSpace. All rights reserved.</p>
          </div>
        </div>
      </footer>
	</div>
  )
}

export default Footer
