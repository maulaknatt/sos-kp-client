import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {BsInstagram} from "react-icons/bs";

export default function FooterCom() {
    return (
        <Footer container className="border border-t-2">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="flex flex-row gap-3 mt-5">
                        <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white">
                        <img src="/public/The kopi logo.jpeg" 
                            alt="logo"
                            className='w-11 h-11' />
                        <p className="mt-3">THe Kopi</p>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                        <Footer.Title title="Follow Us" />
                        <Footer.LinkGroup col>
                            <Footer.Link 
                                href="https://www.instagram.com/thekopi.jkt/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Instagram
                            </Footer.Link>
                        </Footer.LinkGroup>
                        </div>

                        <div>
                        <Footer.Title title="Hubungi Kami" />
                        <Footer.LinkGroup col>
                            <Footer.Link 
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                THeKopi@gmail.com
                            </Footer.Link>
                            <Footer.Link 
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                081234567890
                            </Footer.Link>
                        </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright 
                        href="#"
                        by="THe Kopi"
                        year={new Date().getFullYear()}
                    />
                    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                        <Footer.Icon href="#" icon={BsInstagram}/>
                    </div>
                </div>
            </div>
        </Footer>
    )
}
