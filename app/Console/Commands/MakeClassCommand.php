<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MakeClassCommand extends Command
{
    protected function getMainFolder() {
        return base_path() . "/app/Classes";
    }

    protected function getBaseNamespace() {
        return "App\\Classes";
    }

    const TEXT = "<?php
namespace {{ CLASS_NAMESPACE }};

class {{ CLASS }} {

}
    ";

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:class {class_name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Makes a new class inside app/Classes folder';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $class = trim($this->argument('class_name'), "\\");
        $classExploded = explode("\\", $class);
        $classExplodedCount = count($classExploded);
        $className = $classExploded[$classExplodedCount - 1];
        unset($classExploded[$classExplodedCount - 1]);
        $classExploded = implode("\\", $classExploded);
        $classNamespace = rtrim($this->getBaseNamespace() . "\\" . $classExploded, "\\");

        $folder = str_replace("\\", "/", $this->getMainFolder() . "/" . $classExploded);

        // dd($classNamespace, $folder, $className);

        $folderExploded = explode("/", $folder);

        $curFolder = '';
        foreach ($folderExploded as $_folder) {
            $curFolder .= $_folder . "/";
            if (!is_dir($curFolder)) {
                if (!mkdir($curFolder)) {
                    echo "Class creation failed: could not create folder $curFolder";
                    return 1;
                }
            }
        }

        $text = str_replace(
            ['{{ CLASS_NAMESPACE }}', '{{ CLASS }}'],
            [$classNamespace, $className],
            self::TEXT
        );

        if (file_exists($curFolder . $className . ".php")) {
            echo "Class already exists";
            return 1;
        }

        if (file_put_contents($curFolder . $className . ".php", $text)) {
            echo "Class created successfully!";
            return 0;
        }

        return 1;
        /*
        $namespacesValues = str_replace(DIRECTORY_SEPARATOR, "/", $this->getMainFolder());
        $namespacesValues = explode("/", $namespacesValues);
        $classEndNamespace = explode("\\", $class);
        $className = $classEndNamespace[count($classEndNamespace) - 1];
        $classEndNamespace = array_filter(
            $classEndNamespace,
            function ($el, $index) use ($classEndNamespace) {
                return $index !== count($classEndNamespace) - 1;
            },
            ARRAY_FILTER_USE_BOTH
        );
        $tempNamespace = array_filter(
            explode("\\", $this->getBaseNamespace() . "\\" . trim($class, "\\")),
            function ($el, $index) {
                return $el !== "" && !is_null($el);
            },
            ARRAY_FILTER_USE_BOTH
        );
        $tempNamespaceCount = count($tempNamespace);

        unset($tempNamespace[$tempNamespaceCount - 1]);
        // array_push($namespacesValues, ...$tempNamespace);

        $curRecursiveFolder = "";
        foreach ($namespacesValues as $k => $folder) {
            $curRecursiveFolder .= $folder . "/";
            $curRecursiveFolder = str_replace(
                [
                    "\\\\",
                    "//",
                    "\\/",
                    "/\\"
                ],
                [
                    "/",
                    "/",
                    "/",
                    "/"
                ],
                $curRecursiveFolder
            );
            if (!is_dir($curRecursiveFolder)) {
                if (!mkdir($curRecursiveFolder)) {
                    echo "Could not create $curRecursiveFolder\n";
                    return 1;
                }
            }
        }

        $classPath = $curRecursiveFolder . "/$class.php";
        unset($tempNamespace[count($tempNamespace) - 1]);
        $namespace = implode("\\", $tempNamespace);
        // $classPath = $this->getMainFolder() . $class . ".php";
        $text = str_replace(
            ['{{ CLASS_NAMESPACE }}', '{{ CLASS }}'],
            [$namespace, $className],
            self::TEXT
        );

        // if (file_exists(str_replace(["\\", "//"], "/", $classPath))) {
        //     echo "Class already exists";
        //     return 0;
        // }

        if(file_put_contents(str_replace(["\\", "//"], "/", $classPath), $text)) {
            echo "Class created successfully!";
            return 0;
        }
        // if (!is_dir($this->getMainFolder())) {
        //     if(!mkdir($this->getMainFolder())) {
        //         echo "Could not create folder {$this->getMainFolder()}. Check permissions\n";
        //         return 1;
        //     }
        // }



        return 1;
        */
    }
}
