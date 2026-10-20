import { ChevronDownIcon, ChevronsLeft, Command, HomeIcon, TriangleAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const BreadcrumbWithDropdownDemo = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='#'>
            <Badge variant='outline' className='text-muted-foreground hover:text-foreground'>
              <HomeIcon className='size-3' />
              Home
            </Badge>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator> / </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href='#'>
            <Badge variant='outline' className='text-muted-foreground hover:text-foreground'>
              Design System
            </Badge>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator> / </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>
            <DropdownMenuTrigger>
              <button className='flex items-center gap-1 cursor-pointer text-sm'>
                Components
                <ChevronDownIcon className='size-4' />
              </button>
              <DropdownMenu>
                <DropdownMenuItem><TriangleAlert size={16} />Alert</DropdownMenuItem>
                <DropdownMenuItem><Command size={16} />Buttons</DropdownMenuItem>
                <DropdownMenuItem><ChevronsLeft size={16} />Breadcrumb</DropdownMenuItem>
              </DropdownMenu>
            </DropdownMenuTrigger>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadcrumbWithDropdownDemo
