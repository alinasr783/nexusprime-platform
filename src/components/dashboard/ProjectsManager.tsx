import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Eye, MoreHorizontal, Calendar, User } from 'lucide-react';
import NewProjectForm from './NewProjectForm';

interface ProjectsManagerProps {
  user: any;
}

interface Project {
  id: string;
  name: string;
  description: string;
  goal: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

const ProjectsManager = ({ user }: ProjectsManagerProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user.id]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { 
        variant: 'secondary' as const, 
        label: language === 'ar' ? 'جديد' : 'New' 
      },
      in_progress: { 
        variant: 'default' as const, 
        label: language === 'ar' ? 'قيد التنفيذ' : 'In Progress' 
      },
      review: { 
        variant: 'outline' as const, 
        label: language === 'ar' ? 'مراجعة' : 'Review' 
      },
      completed: { 
        variant: 'outline' as const, 
        label: language === 'ar' ? 'مكتمل' : 'Completed' 
      }
    };

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
  };

  const filterProjectsByStatus = (status?: string) => {
    if (!status) return projects;
    return projects.filter(project => project.status === status);
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    setShowNewProjectForm(false);
    toast({
      title: language === 'ar' ? 'تم إنشاء المشروع' : 'Project Created',
      description: language === 'ar' ? 'تم إنشاء المشروع بنجاح' : 'Project has been created successfully',
    });
  };

  const ProjectCard = ({ project }: { project: Project }) => {
    const statusBadge = getStatusBadge(project.status);
    
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(project.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {project.goal}
                </div>
              </div>
            </div>
            <Badge variant={statusBadge.variant}>
              {statusBadge.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{language === 'ar' ? 'التقدم' : 'Progress'}</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} />
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              {language === 'ar' ? 'عرض' : 'View'}
            </Button>
            <Button size="sm" variant="outline">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (showNewProjectForm) {
    return (
      <NewProjectForm 
        user={user} 
        onProjectCreated={handleProjectCreated}
        onCancel={() => setShowNewProjectForm(false)}
      />
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{language === 'ar' ? 'مشاريعي' : 'My Projects'}</h2>
        <Button onClick={() => setShowNewProjectForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {language === 'ar' ? 'مشروع جديد' : 'New Project'}
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            {language === 'ar' ? 'الكل' : 'All'} ({projects.length})
          </TabsTrigger>
          <TabsTrigger value="new">
            {language === 'ar' ? 'جديد' : 'New'} ({filterProjectsByStatus('new').length})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            {language === 'ar' ? 'قيد التنفيذ' : 'In Progress'} ({filterProjectsByStatus('in_progress').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            {language === 'ar' ? 'مكتمل' : 'Completed'} ({filterProjectsByStatus('completed').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterProjectsByStatus('new').map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterProjectsByStatus('in_progress').map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterProjectsByStatus('completed').map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {projects.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <p>{language === 'ar' ? 'لا توجد مشاريع بعد' : 'No projects yet'}</p>
              <p className="text-sm mt-2">
                {language === 'ar' ? 'ابدأ مشروعك الأول الآن!' : 'Start your first project now!'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectsManager;